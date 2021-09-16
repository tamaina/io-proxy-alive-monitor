あるインスタンスの配信を他のインスタンスから監視します。

## 準備
1. 検査したいインスタンスと検出に用いるインスタンスの双方に新しいアカウントを作成し、それぞれトークンを取得します。
2. 検出アカウントが検査対象アカウントをフォローするようにします。
3. example.jsを参考にsetting.jsを作成してください。
4. cronなどで`node index.js`を定期的に実行するようにしましょう。

## 動作・仕様
1. 検査したいインスタンスのアカウントtryの回数だけ投稿します。  
   ![image](https://user-images.githubusercontent.com/7973572/133556912-22ea3883-9a37-4198-8826-fb8133169524.png)
2. 120秒待ったら、検出アカウントのホームタイムラインを取得します。
3. ホームタイムラインの内容を確認し、すべての投稿がタイムラインに揃っていなければ、検査対象アカウントにその旨のノートを投稿します。
