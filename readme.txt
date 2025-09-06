docker compose commands:
docker-compose -f docker-compose-dev.yml up
docker-compose -f docker-compose-dev.yml up --build
docker-compose -f docker-compose-dev.yml down

kubectl delete <object type> <name of object>
kubectl delete -f <folder> kubectl delete -f k8s/
kubectl apply -f k8s
kubectl get deployments
kubectl get services

kubectl get storageclass
kubectl describe stotageclass

pull logs using kubectl cli:
kubectl logs <pod name>
kubectl logs server-deployment-78df9887cc-csr6q

k8s version
one config file for each object

pods run one or more closely realted containers

nodeport vs cluster ip:
nodeport only for development, exposes pods to the outside world
cluster IP exposes a set of pods to other objects, more restrictive
remember your ports is how the pod is going to be accessed

custerIPs are necessary to expose pods to other services/pods
services are only necessary to handle requests
with the worker config there are no requests only data processing
no services or port config for the worker component

when running configfiles:
kubectl apply -f k8s, make sure your in the parent directory that contains k8 or the configfiles

------ It is possible to combine objects into a single file ------
is it bad practice for readibilty? preference at this point, way easier to understand when seperated
naming is super important
--- <-- is required between objects in config files if combined

pull logs using kubectl cli:
kubectl logs <pod name>
kubectl logs server-deployment-78df9887cc-csr6q

defining environment variables
environment variables are urls to the passwords





