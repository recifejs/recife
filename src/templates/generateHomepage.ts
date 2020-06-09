const generateHomepage = (application: string, version: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>RecifeJS</title>
        <style>
        html { height: 100vh; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            height: calc(100vh - 60px);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            margin: 0;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }
        img { width: 400px; max-width: 100%; }
        .links { margin: 50px 0px; }
        .links a {
            border: 1px solid #0d47a1;
            border-radius: 3px;
            color: #0d47a1;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.2em;
            padding: 10px;
            text-decoration: none !important;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .links a:hover { background-color: #eceff1; }
        footer {
            width: 100vw;
            padding: 20px;
            color: #37474f;
            position: absolute;
            bottom: 0px;
            left: 0px;
            text-align: center;
            box-sizing: border-box;
            border-top: 3px solid #0d47a1;
            color: #0d47a1;
        }
        </style>
    </head>
    <body>
        <img alt="RecifeJs" src="https://recifejs.netlify.app/img/logo.svg" />
        <p>Application: ${application} | Version:${version}</p>
        <div class="links">
        <a href="/graphql">Graphql Playground</a>
        <a target="_blank" href="https://recifejs.netlify.app/">Documentação</a>
        <a target="_blank" href="https://github.com/recifejs/recife">Github</a>
        </div>
        <footer>
        Copyright © 2020 RecifeJs
        </footer>
    </body>
    </html>
`;

export default generateHomepage;
