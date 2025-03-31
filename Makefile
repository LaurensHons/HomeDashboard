.PHONY: help

build: 
	ng b home-modules  && \
	ng b home-page --optimization=true --base-href ./ && \
	 rm /DATA/AppData/nginx/homepage/html/dashboard/ -r && \
	 cp /home/lorry/HomePage/HomePage/dist/home-page/. /DATA/AppData/nginx/homepage/html/dashboard/ -a -r

livebuild: 
	ng b home-page \
	 --watch \
	 --output-path=/DATA/AppData/nginx/homepage/html/dashboard/ --base-href ./