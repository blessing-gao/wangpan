npm run build
docker build -t weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui:zy .
docker push weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui:zy
#docker rm -f document-ui
#docker run -d -p 8000:8000 --name=document-ui weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui
