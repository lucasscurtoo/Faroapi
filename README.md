## ¿Que es Faro?
Faro es una simple solución a un problema muy común en nuestra sociedad, la deserción estudiantil, esta aplicación web es un proyecto de Ánima (Un bachillerato tecnológico en Uruguay) como parte de una solución a la deserción estudiantil, Faro busca mediante su aplicación web que el estudiante que tenga dudas sobre que estudiar, donde estudiar o directamente no lo sepa pueda encontrar un amparo y no deje de buscar que es lo que podría llegar a ser su profesión.

## ---- GIT FLOW ----

`develop` es la rama principal, siempre hay que traer los cambios que se pushean en develop.

`master` es la rama que sale a produccion, solo se suben cosas cuando hacemos una release (se planean)

siempre hacer lo siguiente antes de empezar a trabajar:

`$ git checkout develop`

`$ git pull origin develop --rebase`

para crear otra rama hacemos esto, siempre parados en develop:

`$ git checkout -b my-feature`

## Subir archivos a GitHub

para añadir archivos hacemos:

`$ git add "nombre archivo"`

para hacer un commit:

`$ git commit -m "nombre de la feature a subir"`

para subir lo que acabamos de commitear:

`$ git push origin "nombre branch en la que estamos parados"`

Despues vamos a github y hacemos el pr de la branch que acabamos de crear a `develop` y asignamos como reviewers a todos los del equipo y esperamos a que alguien nos de el ok para mergear esa branch a `develop`

## Instalación y ejecución
Para instalar hacemos `npm install` para instalar todas las librerias
Para ejecutar hacemos `npm run dev` para correr el backend
    
## Tecnologias

`Node.js` https://nodejs.org/en/ 

`Typescript` https://www.typescriptlang.org/

`Express` https://expressjs.com/es/

## Libraries

`Body parser` https://apuntes.de/nodejs-desarrollo-web/body-parser/#gsc.tab=0

`cors` https://expressjs.com/en/resources/middleware/cors.html

`dotenv` https://github.com/motdotla/dotenv

`jsonwebtoken` https://www.npmjs.com/package/jsonwebtoken

`jwt-simple` https://www.npmjs.com/package/jwt-simple

`mysql` https://www.npmjs.com/package/mysql

`mysql2` https://www.npmjs.com/package/mysql2
