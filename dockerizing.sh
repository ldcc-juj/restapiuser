echo "start dockerizing!"
echo "."
echo ".."
echo "..."

sudo docker stop $(docker ps -q -a  --filter="name=leaflo-api-test")
sudo docker rm $(docker ps -q -a --filter="name=leaflo-api-test")

result=`docker images leaflo-api-test`
target=`echo $result | cut -d ' ' -f9`
sudo docker rmi $target

sudo docker build -t leaflo-api-test:v0.1 .
sudo docker run --name=leaflo-api-test -d -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Seoul -p 3000:3000 leaflo-api-test:v0.1

echo "."
echo "."
echo "."
echo "completed leaflo-api-test dockerizing!"
