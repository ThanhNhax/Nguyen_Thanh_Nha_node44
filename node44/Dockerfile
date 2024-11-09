# cài môi trường cho node
FROM node:20

# tạo folder chứa src
WORKDIR /home/app

# copy file package.json và package-lock.json
COPY package*.json ./

# cài lib trong file package.json
RUN npm install

# copy prims từ local sang docker
# vừa copy từ local vừa tạo folder mới có tên prisma trong docker
COPY prisma ./prisma

# tạo prisma client
RUN npx prisma generate

# copy toàn bộ src vào docker
COPY . .

# expose port 
EXPOSE 8080

# chạy src be
CMD [ "npm","run","start" ]
