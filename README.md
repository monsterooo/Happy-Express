## Happy-express

这是一个express模板，它集成了webpack的编译环境。

### javascript

所有的javascript文件被放到`views/packs`文件夹中，如果要在视图中引入某个javascript需要这样调用`<script src="/javascripts/<%= javascript_pack('application') %>"></script>`即可引入在`views/packs/application.js`编译好的js。

所有被编译好的javascript被放置在`public/javascripts`文件夹中