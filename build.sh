npm run build
docker build -t weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui .
#docker push weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui
docker rm -f document-ui
docker run -d -p 8001:80 --name=document-ui weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui
