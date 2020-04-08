const express = require("express");
const cors = require("cors");

const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Consulta que retorna todos os repositórios
 */
app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});
/**
 * Criar um novo repositório
 * utilizando o metodo POST e Request Body
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs }  = request.body;
  const project = { id: uuid(), title, url, techs , likes: 0 };
  
  console.log(isUuid(project.id));
  repositories.push(project);

  response.status(200).json(project);
});
/**
 * A rota deve alterar apenas o título, a url e as techs do 
 * repositório que possua o id igual ao id presente nos parâmetros da rota
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url,title, techs } = request.body;

  const project = repositories.find(project => project.id === id);

  const projectindex = repositories.findIndex(project => project.id === id);
  if (projectindex < 0){
      return response.status(400).json({ error: "project not found" });
  }
  const update = {id, url , title, techs, likes: project.likes };
  repositories[projectindex] = update;

  return response.status(200).json(update);
});
/**
 *  A rota deve deletar o repositório com o id presente nos parâmetros da rota;
 */
app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const projectindex = repositories.findIndex(project => project.id === id);
    if (projectindex < 0){
        return response.status(400).json({ error: "project not found" });
    }
    repositories.splice(projectindex, 1);
    return response.status(204).send();
});
/**
 * A rota deve aumentar o número de likes do repositório específico escolhido 
 * através do id presente nos parâmetros da rota, a cada chamada dessa rota, o 
 * número de likes deve ser aumentado em 1
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const project = repositories.find(project => project.id === id);

  const projectindex = repositories.findIndex(cproject => cproject.id === id);
  if (projectindex < 0){
      return response.status(400).json({ error: "project not found" });
  }
  project.likes += 1;
  repositories[projectindex] = project;

  return response.status(200).json(project);
});

module.exports = app;
