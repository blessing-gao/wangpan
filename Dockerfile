FROM bitnami/nginx:1.18

WORKDIR /app
# 设置默认环境变量
ENV API_BACKEND=http://document-svc

COPY nginx.conf /opt/bitnami/nginx/conf/nginx.conf
COPY dist /app
# 使用 sed 替换配置文件中的变量
RUN sed -i "s|\$API_BACKEND|$API_BACKEND|g" /opt/bitnami/nginx/conf/nginx.conf


