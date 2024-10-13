import { CdkDragEnter, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, first, takeUntil } from 'rxjs';
import { v4 } from 'uuid';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { CardModule } from 'primeng/card';
import { PartTypes } from '../../services/dashboard.service';

enum ResizeDirection {
  Top = 'n',
  TopRight = 'ne',
  Right = 'e',
  BottomRight = 'se',
  Bottom = 's',
  BottomLeft = 'sw',
  Left = 'w',
  TopLeft = 'nw',
}

export class Part {
  id!: string;
  typeName!: string;
  private _type!: Type<any>;

  get type() {
    if (this._type) return this._type;
    return PartTypes()[this.typeName].type;
  }

  x!: number;
  y!: number;
  width!: number;
  height!: number;
  constructor(obj: Partial<Part>) {
    Object.assign(this, obj);
  }
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DragDropModule,
    MatButtonModule,
    MatMenuModule,
    NgComponentOutlet,
    CardModule,
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() edit = false;
  @Input() minBlockSize = 128;
  @Input() maxBlockSize?: number;
  @Input() gridGap = 8;
  @Input() cellClass = '';
  @Input() elements: Part[] = [];
  @Input() addMenu: MatMenuPanel<any> | null = null;

  @Output() elementsChanged = new EventEmitter<Part[]>();
  @Output() elementChanged = new EventEmitter<string>();
  @Output() focusChange = new EventEmitter<string>();

  @ViewChild('pageGrid') pageGrid?: ElementRef<HTMLElement>;

  blockSize = 0;
  rowHeight = 'auto';

  dragging: Part | null = null;
  canPlace = true;

  private resizeObserver?: ResizeObserver;

  rowCount = 0;

  PartPosTrackBy = (_index: number, item: Part) => item.id;
  indexTrackBy = (index: number) => index;

  ResizeDirection = ResizeDirection;

  // Resize part

  selectedPart?: Part;
  editingPart?: Part;
  resizingDirection?: ResizeDirection;
  moveRelativeCell?: { x: number; y: number };
  lockedCursor?: string;

  get bodyWidth() {
    return document.body.clientWidth;
  }

  get columnAmount() {
    if (!this.edit && this.bodyWidth < 480) return 1;
    return 12;
  }

  get gridGapAdjusted() {
    if (this.gridGap <= 0) return 0;
    return Math.ceil(this.gridGap / (12 / this.columnAmount));
  }

  get pageHeight() {
    return (
      this.rowCount * (this.blockSize + this.gridGapAdjusted) +
      this.gridGapAdjusted
    );
  }
  get pageWidth() {
    return (
      this.columnAmount * (this.blockSize + this.gridGapAdjusted) +
      this.gridGapAdjusted
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['edit'] || changes['elements']) {
      this.adjustMaxRows();
      this.calculatePartGridAreas();
    }
  }

  adjustMaxRows() {
    this.rowCount = Math.max(
      ...this.elements.map((w) => w.y + w.height + 5),
      20
    );
  }

  MouseToGridCoordinates(event: MouseEvent | TouchEvent) {
    const boundingRect = this.pageGrid!.nativeElement.getBoundingClientRect();
    const clientX =
      'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY =
      'clientY' in event ? event.clientY : event.touches[0].clientY;
    return {
      x: Math.floor(
        (clientX - boundingRect.left - this.gridGapAdjusted / 2) /
          (this.blockSize + this.gridGapAdjusted)
      ),
      y: Math.floor(
        (clientY - boundingRect.top - this.gridGapAdjusted / 2) /
          (this.blockSize + this.gridGapAdjusted)
      ),
    };
  }

  calculatePartGridAreas() {
    const partPositions: Part[] = [];
    // First we sort the web parts so that from top left to bottom right
    const webparts = [...this.elements].sort((wp1, wp2) => {
      if (wp1.y === wp2.y) return wp1.x - wp2.x;
      return wp1.y - wp2.y;
    });
    // Then we calculate the grid areas for each web part based on the grid size, moving and resizing webparts when necessary
    webparts.forEach((w) => {
      const pos = w;
      if (!this.edit && this.columnAmount == 1) {
        pos.x = 1;
        pos.width = 1;
        // Find first open spot for the webpart from top left
        let openY = 1;
        while (
          partPositions.some(
            (wp) => wp.y < openY + pos.height && wp.y + wp.height > openY
          )
        ) {
          openY++;
        }
        pos.y = openY;
      }
      partPositions.push(pos);
    });
    this.elements = partPositions;
    //this.emitValueChanges();
  }

  emitValueChanges() {
    this.elementsChanged.emit(this.elements);
  }

  /*
  public getAddContextMenuActions() {
    return WebPartTypeMapper.mapToContextMenuActions(this.types, (type) =>
      this.addWebPart(type)
    );
  }
  */

  public checkOverlapping(p: {
    id: string;
    width: number;
    height: number;
    x: number;
    y: number;
  }) {
    return this.elements.some(
      (w) =>
        w.id !== p.id &&
        w.x < p.x + p.width &&
        w.x + w.width > p.x &&
        w.y < p.y + p.height &&
        w.y + w.height > p.y
    );
  }

  resizePart = (event: MouseEvent | TouchEvent) => {
    if (this.pageGrid && this.editingPart) {
      const resizingPartPosition = this.editingPart;

      const mouseCell = this.MouseToGridCoordinates(event);

      if (mouseCell.x > this.columnAmount - 1)
        mouseCell.x = this.columnAmount - 1;
      if (mouseCell.x < 0) mouseCell.x = 0;
      if (mouseCell.y > this.rowCount - 1) mouseCell.y = this.rowCount - 1;
      if (mouseCell.y < 0) mouseCell.y = 0;
      switch (this.resizingDirection) {
        case ResizeDirection.Top: {
          const topHeightDelta = mouseCell.y - resizingPartPosition.y;
          if (resizingPartPosition.height - topHeightDelta > 0) {
            resizingPartPosition.height -= topHeightDelta;
            resizingPartPosition.y += topHeightDelta;
          }
          break;
        }
        case ResizeDirection.Bottom: {
          const bottomHeightDelta =
            resizingPartPosition.y +
            resizingPartPosition.height -
            mouseCell.y -
            1;
          if (resizingPartPosition.height - bottomHeightDelta > 0) {
            resizingPartPosition.height -= bottomHeightDelta;
          }
          break;
        }
        case ResizeDirection.Left: {
          const leftWidthDelta = mouseCell.x - resizingPartPosition.x;
          if (resizingPartPosition.width - leftWidthDelta > 0) {
            resizingPartPosition.width -= leftWidthDelta;
            resizingPartPosition.x += leftWidthDelta;
          }
          break;
        }
        case ResizeDirection.Right: {
          const rightWidthDelta =
            resizingPartPosition.x +
            resizingPartPosition.width -
            mouseCell.x -
            1;
          if (resizingPartPosition.width - rightWidthDelta > 0) {
            resizingPartPosition.width -= rightWidthDelta;
          }
          break;
        }
        case ResizeDirection.TopRight: {
          const topHeightDelta = mouseCell.y - resizingPartPosition.y;
          if (resizingPartPosition.height - topHeightDelta > 0) {
            resizingPartPosition.height -= topHeightDelta;
            resizingPartPosition.y += topHeightDelta;
          }
          const rightWidthDelta =
            resizingPartPosition.x +
            resizingPartPosition.width -
            mouseCell.x -
            1;
          if (resizingPartPosition.width - rightWidthDelta > 0) {
            resizingPartPosition.width -= rightWidthDelta;
          }
          break;
        }
        case ResizeDirection.BottomRight: {
          const bottomHeightDelta =
            resizingPartPosition.y +
            resizingPartPosition.height -
            mouseCell.y -
            1;
          if (resizingPartPosition.height - bottomHeightDelta > 0) {
            resizingPartPosition.height -= bottomHeightDelta;
          }
          const rightWidthDelta =
            resizingPartPosition.x +
            resizingPartPosition.width -
            mouseCell.x -
            1;
          if (resizingPartPosition.width - rightWidthDelta > 0) {
            resizingPartPosition.width -= rightWidthDelta;
          }
          break;
        }
        case ResizeDirection.BottomLeft: {
          const bottomHeightDelta =
            resizingPartPosition.y +
            resizingPartPosition.height -
            mouseCell.y -
            1;
          if (resizingPartPosition.height - bottomHeightDelta > 0) {
            resizingPartPosition.height -= bottomHeightDelta;
          }
          const leftWidthDelta = mouseCell.x - resizingPartPosition.x;
          if (resizingPartPosition.width - leftWidthDelta > 0) {
            resizingPartPosition.width -= leftWidthDelta;
            resizingPartPosition.x += leftWidthDelta;
          }
          break;
        }
        case ResizeDirection.TopLeft: {
          const topHeightDelta = mouseCell.y - resizingPartPosition.y;
          if (resizingPartPosition.height - topHeightDelta > 0) {
            resizingPartPosition.height -= topHeightDelta;
            resizingPartPosition.y += topHeightDelta;
          }
          const leftWidthDelta = mouseCell.x - resizingPartPosition.x;
          if (resizingPartPosition.width - leftWidthDelta > 0) {
            resizingPartPosition.width -= leftWidthDelta;
            resizingPartPosition.x += leftWidthDelta;
          }
          break;
        }
      }
      if (
        !this.checkOverlapping({
          id: this.editingPart!.id,
          height: resizingPartPosition.height,
          width: resizingPartPosition.width,
          x: resizingPartPosition.x,
          y: resizingPartPosition.y,
        })
      ) {
        this.editingPart!.x = resizingPartPosition.x;
        this.editingPart!.y = resizingPartPosition.y;
        this.editingPart!.width = resizingPartPosition.width;
        this.editingPart!.height = resizingPartPosition.height;

        const pos = this.elements.find((wp) => wp.id === this.editingPart!.id);
        if (pos) {
          pos.x = resizingPartPosition.x;
          pos.y = resizingPartPosition.y;
          pos.width = resizingPartPosition.width;
          pos.height = resizingPartPosition.height;
        }
      }
    }
  };
  stopResizeWebPart = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) {
      document.removeEventListener('touchmove', this.resizePart);
      document.removeEventListener('touchend', this.stopResizeWebPart);
    } else {
      document.removeEventListener('mousemove', this.resizePart);
      document.removeEventListener('mouseup', this.stopResizeWebPart);
    }
    this.elementChanged.emit(this.editingPart!.id);
    this.editingPart = undefined;
    this.resizingDirection = undefined;
    this.lockedCursor = undefined;
    this.adjustMaxRows();
    this.calculatePartGridAreas();
    this.emitValueChanges();
  };

  private cursorForDirection(direction: ResizeDirection) {
    switch (direction) {
      case ResizeDirection.Top:
      case ResizeDirection.Bottom:
        return 'ns-resize';
      case ResizeDirection.Left:
      case ResizeDirection.Right:
        return 'ew-resize';
      case ResizeDirection.TopRight:
      case ResizeDirection.BottomLeft:
        return 'nesw-resize';
      case ResizeDirection.TopLeft:
      case ResizeDirection.BottomRight:
        return 'nwse-resize';
    }
  }

  startResizePart(
    part: Part,
    direction: ResizeDirection,
    event: MouseEvent | TouchEvent
  ) {
    if (
      !this.pageGrid ||
      (event instanceof TouchEvent && event.touches.length > 1)
    )
      return;
    event.stopImmediatePropagation();
    event.preventDefault();
    this.editingPart = part;
    this.resizingDirection = direction;
    this.lockedCursor = this.cursorForDirection(direction);
    if (event instanceof TouchEvent) {
      document.addEventListener('touchmove', this.resizePart);
      document.addEventListener('touchend', this.stopResizeWebPart);
    } else {
      document.addEventListener('mousemove', this.resizePart);
      document.addEventListener('mouseup', this.stopResizeWebPart);
    }
  }

  moveWebPart = (event: MouseEvent | TouchEvent) => {
    if (this.pageGrid) {
      const mouseCell = this.MouseToGridCoordinates(event);

      if (mouseCell.x > this.columnAmount - 1)
        mouseCell.x = this.columnAmount - 1;
      if (mouseCell.x < 0) mouseCell.x = 0;
      if (mouseCell.y > this.rowCount - 1) mouseCell.y = this.rowCount - 1;
      if (mouseCell.y < 0) mouseCell.y = 0;
      const webPart = this.editingPart!;
      const width = webPart.width;
      const height = webPart.height;
      const x = mouseCell.x - this.moveRelativeCell!.x;
      const y = mouseCell.y - this.moveRelativeCell!.y;
      if (
        x >= 0 &&
        x <= this.columnAmount - width &&
        y >= 0 &&
        y <= this.rowCount - height &&
        !this.checkOverlapping({
          id: webPart.id,
          x,
          y,
          width,
          height,
        })
      ) {
        webPart.x = x;
        webPart.y = y;
        const pos = this.elements.find((wp) => wp.id === webPart.id);
        if (pos) {
          pos.x = x;
          pos.y = y;
        }
      }
    }
  };

  stopMoveWebPart = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) {
      document.removeEventListener('touchmove', this.moveWebPart);
      document.removeEventListener('touchend', this.stopMoveWebPart);
    } else {
      document.removeEventListener('mousemove', this.moveWebPart);
      document.removeEventListener('mouseup', this.stopMoveWebPart);
    }
    this.elementChanged.emit(this.editingPart!.id);
    this.editingPart = undefined;
    this.moveRelativeCell = undefined;
    this.lockedCursor = undefined;
    this.calculatePartGridAreas();
    this.emitValueChanges();
  };

  startMoveWebPart(webPart: Part, event: MouseEvent | TouchEvent) {
    if (
      !this.pageGrid ||
      (event instanceof TouchEvent && event.touches.length > 1)
    )
      return;
    event.stopImmediatePropagation();
    event.preventDefault();
    this.editingPart = webPart;
    this.selectedPart = webPart;
    this.focusChange.emit(webPart.id);
    const mouseCell = this.MouseToGridCoordinates(event);

    this.moveRelativeCell = {
      x: mouseCell.x - webPart.x,
      y: mouseCell.y - webPart.y,
    };
    this.lockedCursor = 'grabbing';
    if (event instanceof TouchEvent) {
      document.addEventListener('touchmove', this.moveWebPart);
      document.addEventListener('touchend', this.stopMoveWebPart);
    } else {
      document.addEventListener('mousemove', this.moveWebPart);
      document.addEventListener('mouseup', this.stopMoveWebPart);
    }
  }

  startMoveAddWebPart(webPart: Part, event: MouseEvent | TouchEvent) {
    if (
      !this.pageGrid ||
      (event instanceof TouchEvent && event.touches.length > 1)
    )
      return;
    event.stopImmediatePropagation();
    event.preventDefault();
    this.editingPart = webPart;
    this.selectedPart = webPart;
    this.focusChange.emit(webPart.id);
    const mouseCell = this.MouseToGridCoordinates(event);

    this.moveRelativeCell = {
      x: mouseCell.x - webPart.x,
      y: mouseCell.y - webPart.y,
    };
    this.lockedCursor = 'grabbing';
    if (event instanceof TouchEvent) {
      document.addEventListener('touchmove', this.moveWebPart);
      document.addEventListener('touchend', this.stopMoveWebPart);
    } else {
      document.addEventListener('mousemove', this.moveWebPart);
      document.addEventListener('mouseup', this.stopMoveWebPart);
    }
  }

  ngAfterViewInit(): void {
    if (this.pageGrid) {
      setTimeout(() => {
        this.blockSize = Math.max(
          this.minBlockSize,
          (this.pageGrid!.nativeElement.clientWidth -
            this.gridGapAdjusted * (this.columnAmount + 1)) /
            this.columnAmount
        );
        if (this.maxBlockSize)
          this.blockSize = Math.min(this.blockSize, this.maxBlockSize);
        this.rowHeight = this.blockSize + 'px';
      }, 0);
      this.resizeObserver = new ResizeObserver(() => {
        if (this.pageGrid) {
          this.blockSize = Math.max(
            this.minBlockSize,
            (this.pageGrid!.nativeElement.clientWidth -
              this.gridGapAdjusted * (this.columnAmount + 1)) /
              this.columnAmount
          );
          if (this.maxBlockSize)
            this.blockSize = Math.min(this.blockSize, this.maxBlockSize);
          this.rowHeight = this.blockSize + 'px';
          this.adjustMaxRows();
          this.calculatePartGridAreas();
        }
      });
      this.resizeObserver.observe(this.pageGrid.nativeElement);
    }
  }

  removePart(part: Part) {
    this.elements = this.elements.filter((e) => e.id !== part.id);
    this.emitValueChanges();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.pageGrid) {
      this.resizeObserver?.unobserve(this.pageGrid.nativeElement);
    }
  }
}
