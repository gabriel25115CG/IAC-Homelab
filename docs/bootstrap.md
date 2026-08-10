# Bootstrap initial (à faire une seule fois)

Prérequis : le cluster Talos est provisionné (voir `terraform/README.md`), `kubectl` et `kubeseal` sont installés localement.

## 1. Récupérer le kubeconfig

```bash
cd terraform/talos
terraform output -raw kubeconfig > ../../kubeconfig
export KUBECONFIG=$(pwd)/../../kubeconfig
kubectl get nodes
```

## 2. Installer ArgoCD

```bash
kubectl apply -k kubernetes/bootstrap/argocd
kubectl -n argocd rollout status deploy/argocd-server
```

Récupérer le mot de passe admin initial et accéder à l'UI (optionnel, en port-forward) :

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
kubectl -n argocd port-forward svc/argocd-server 8080:443
```

## 3. Déployer l'app of apps

```bash
kubectl apply -f kubernetes/bootstrap/argocd/app-of-apps.yaml
```

L'`ApplicationSet` `apps` va scanner `kubernetes/apps/*` du repo et créer une `Application` ArgoCD par sous-dossier : `metallb`, `sealed-secrets`, `cert-manager`, `longhorn`, `traefik`, `demo-app`.

## 4. Installer le token Cloudflare pour cert-manager

Le fichier `kubernetes/apps/cert-manager/cloudflare-api-token-sealed-secret.yaml` est un placeholder : il doit être régénéré avec `kubeseal` une fois le controller Sealed Secrets démarré (déployé automatiquement par l'`Application` `sealed-secrets`).

```bash
kubectl create secret generic cloudflare-api-token-secret \
  --namespace cert-manager \
  --from-literal=api-token=<TON_TOKEN_CLOUDFLARE> \
  --dry-run=client -o yaml > cloudflare-api-token-secret.yaml

kubeseal --format yaml \
  --controller-name sealed-secrets \
  --controller-namespace kube-system \
  < cloudflare-api-token-secret.yaml > kubernetes/apps/cert-manager/cloudflare-api-token-sealed-secret.yaml

rm cloudflare-api-token-secret.yaml
git add kubernetes/apps/cert-manager/cloudflare-api-token-sealed-secret.yaml
git commit -m "cert-manager: real sealed cloudflare token"
git push
```

ArgoCD synchronisera automatiquement le nouveau `SealedSecret`.

## 5. Vérifier

```bash
kubectl -n argocd get applications
kubectl -n metallb-system get ipaddresspool,l2advertisement
kubectl -n traefik get svc traefik
kubectl -n demo-app get ingress
```

Une fois le certificat émis, `https://demo.gabriel0day.cloud` doit répondre.
