const express = require('express');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [{id: uuid(), title: 'teste'}];

function logRequests(request, response, next) {
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);
    
    next();
    
    console.timeEnd(logLabel);
}

app.use(logRequests);

app.get('/projects', (request, respose) => { 
    const { title } = request.query;

    const projectsList = title ?
        projects.filter(project => project.title === title) : projects;
    return respose.json(projectsList);
});

app.post('/projects', (request, respose) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return respose.json(project);
});

app.put('/projects/:id', (request, respose) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found'});
    }

    const project = {
        id, 
        title,
        owner
    };

    projects[projectIndex] = project;

    return respose.json(project);
});

app.delete('/projects/:id', (request, respose) => {
    const { id } = request.params; 

    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found'});
    } 

    projects.splice(projectIndex, 1);

    return respose.status(204).json();
});

app.listen(3333, () => { 
    console.log(' 👌 Server started! ')
});