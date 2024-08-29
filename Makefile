.PHONY: help

build: 
	ng b --base-href ./ && \
	 rm /DATA/AppData/nginx/homepage/html/dashboard/ -r && \
	 cp /home/lorry/HomePage/HomeDashboard/dist/home-dashboard/. /DATA/AppData/nginx/homepage/html/dashboard/ -a -r

livebuild: 
	ng b \
	 --watch \
	 --output-path=/DATA/AppData/nginx/homepage/html/dashboard/ --base-href ./