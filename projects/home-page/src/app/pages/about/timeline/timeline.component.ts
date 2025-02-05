import { Component } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CoreModule } from '../../../core.modulte';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimelineModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  timelineEvents: { title?: string; description?: string; time?: string }[] = [
    {
      time: '2018 - PRESENT',
      title: 'Swimming Instructor & IT co-admin',
      description:
        "I've been a proud member of my swimming club for many years, where I've not only honed my swimming skills but also actively participated in the club's website administration & development. \n Alongside swimming, I’ve also enjoyed playing basketball and exploring other sports, which have all helped me develop teamwork and leadership skills. Later i also became co-Admin of the club's website, where i improved the site's responsivity, ease of use and news events.",
    },
    {
      time: '2018 - 2022',
      title: 'Restaurant and Catering work',
      description:
        'I began my career in hospitality as a waiter, where I developed a strong work ethic, the ability to work efficiently under pressure, and time management skills. I continued working in horeca further as i joined a local catering companies serving diners in VIP sections of Leuven Bears and OHL.',
    },
    {
      time: '2021-09 - 2022-06',
      title: 'IT Support UCLL',
      description:
        'My main tasks at the IT support denk was assisting UCLL Students or teachers with technical questions and providing assistance. Diagnosing and resolving technical issues on campus. And logging all work I have done in a generic ticketing system to ensure all problems are resolved and have been looked at.',
    },
    {
      time: '2019 - 2023',
      title: 'Education',
      description:
        'I graduated from UCLL Applied Informatics in 2023 which ended in an internship at ProcessDelight in Herent. I have learned multiple technologies and frameworks, but have also learned different ways to approach a problem.',
    },
    {
      time: '2022-09 - 2023-01',
      title: 'Internship Junior Software Developer',
      description:
        'At my internship at Processdelight in Herent I was tasked with developing an Angular-based text editor with advanced functionalities, including mass text replacement, tag assignment, and autmatic tranlsations to enhance user efficiency when creating large complicated documents. I also had to create a C# based backend to handle CRUD requests. And all this while using the agile methodologies, using tickets and sprints to manage project timelines.',
    },
    {
      time: '2023 - PRESENT',
      title: 'Softare Developer',
      description:
        'Contributed to the development of multiple web applications, integrating them seamlessly with a central portal via iframes. Applied strong problem-solving skills to quickly identify and resolve issues, adhering to Agile workflows through sprints, user story creation, and meticulous bug logging. Actively participated in team meetings, code reviews, and estimation sessions, offering constructive feedback to drive continuous improvement. Progressed from a junior developer to taking on responsibilities such as conducting code reviews, enhancing code quality, and ensuring reliability in collaboration with external developers. Engineered a dynamic form with customizable, movable input fields for integration across various applications and implemented Microsoft Graph to deliver notifications, calendar events, and emails within the platform.',
    },
  ];
}
