const express = require('express');
const { Router } = express;
const routerProductos = Router();
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use('/api/productos', routerProductos);
app.use(express.static('public'));

routerProductos.use(cors('*'));
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

// GET
routerProductos.get('/', (req, res) => {
	res.send(productos);
});

routerProductos.get('/:id', (req, res) => {
	let { id } = req.params;
	let response = null;

	const producto = productos.filter((p) => p.id === parseInt(id));

	!producto.length
		? (response = { error: 'producto no encontrado' })
		: (response = producto);
	res.json(response);
});

// POST
routerProductos.post('/', (req, res) => {
	let producto = req.body;
	producto.price = parseInt(producto.price);
	producto.id = parseInt(producto.id);
	let response = null;
	let ids = [];

	const productoExistente = productos.filter((p) => p.title === producto.title);
	productos.forEach((p) => ids.push(p.id));

	if (!productoExistente.length) {
		let maxId = Math.max(...ids);
		producto['id'] = maxId + 1;
		productos.push(producto);
		response = producto;
	} else {
		response = { error: 'producto existente' };
	}
	res.json(response);
});

routerProductos.post('/:id', (req, res) => {
	let productoEditado = req.body;
	let response = null;
	productoEditado.price = parseInt(productoEditado.price);
	productoEditado.id = parseInt(productoEditado.id);

	const productoOriginal = productos.filter(
		(p) => p.id === parseInt(productoEditado.id)
	);

	if (!productoOriginal.length) {
		response = { error: 'producto no encontrado' };
	} else {
		const index = productos.indexOf(productoOriginal[0]);
		if (productoEditado.hasOwnProperty('title')) {
			productos.splice(index, 1, productoEditado);
			response = productos[index];
		} else {
			productos.splice(index, 1);
			response = productos;
		}
	}
	res.json(response);
});

// PUT
routerProductos.put('/:id', (req, res) => {
	let { id } = req.params;
	let productoEditado = req.body;
	let response = null;

	const productoOriginal = productos.filter((p) => p.id === parseInt(id));

	if (!productoOriginal.length) {
		response = { error: 'producto no encontrado' };
	} else {
		const index = productos.indexOf(productoOriginal[0]);
		productos.splice(index, 1, productoEditado);
		response = productos[index];
	}
	res.json(response);
});

// DELETE
routerProductos.delete('/:id', (req, res) => {
	let { id } = req.params;
	let response = null;

	const producto = productos.filter((p) => p.id === parseInt(id));

	if (!producto.length) {
		response = { error: 'producto no encontrado' };
	} else {
		const index = productos.indexOf(producto[0]);
		productos.splice(index, 1);
		response = productos;
	}
	res.json(response);
});

// SERVER LISTEN
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on('error', (error) => console.log(`Error en servidor ${error}`));

let productos = [
	{
		title: 'Sandia',
		price: 123,
		thumbnail: 'https://cdn-icons-png.flaticon.com/512/415/415731.png',
		id: 1,
	},
	{
		title: 'Frutilla',
		price: 456,
		thumbnail: 'https://cdn-icons-png.flaticon.com/512/590/590685.png',
		id: 2,
	},
	{
		title: 'Manzana',
		price: 789,
		thumbnail: 'https://cdn-icons-png.flaticon.com/512/415/415733.png',
		id: 3,
	},
];
