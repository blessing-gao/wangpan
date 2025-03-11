npm run build
docker build -t weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui:zy .
docker push weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui:zy
#docker rm -f document-ui
#docker run -d -p 80:80 --name=document-ui weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui:1.0
