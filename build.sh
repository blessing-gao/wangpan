npm run build
docker build -t weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui .
docker push weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui
#docker rm -f document-ui
#docker run -d -p 8000:8000 --name=document-ui weiwoyonzhe-docker.pkg.coding.net/zheyin/document/document-ui
