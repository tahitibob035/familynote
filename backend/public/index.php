<?php

use App\Model\Database;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;
use Slim\Exception\HttpNotFoundException;

require_once __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

$app->addRoutingMiddleware();
$app->add(new BasePathMiddleware($app));

$app->addErrorMiddleware(true, true, true);

$app->get('/', function (Request $request, Response $response) {
	$file = './index.html';
	if (file_exists($file)) {
		$response->getBody()->write(file_get_contents($file));
		return $response;
	} else {
		throw new HttpNotFoundException($request);
	}
});

$app->get('/api/events', function (Request $request, Response $response) {
	$sql = "SELECT * FROM events";
   
	try {
		$db = new Database();
		$conn = $db->connect();
		$stmt = $conn->query($sql);
		$events = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

		$response->getBody()->write(json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
		return $response
		->withHeader('content-type', 'application/json; charset=UTF-8')
		->withStatus(200);
	} catch (PDOException $e) {
		$error = array(
		"message" => $e->getMessage()
		);

		$response->getBody()->write(json_encode($error));
		return $response
		->withHeader('content-type', 'application/json; charset=UTF-8')
		->withStatus(500);
	}
});

$app->post('/api/events', function (Request $request, Response $response) {
	try {
		$data = $request->getParsedBody();
		assert($data['label'] != '', "Expected label parameter");
		assert($data['datetime'] != '', "Expected datetime parameter");
		assert($data['location'] != '', "Expected location parameter");

	} catch (AssertionError $e) {
		$error = array(
			"message" => $e->getMessage()
			);
	
			$response->getBody()->write(json_encode($error));
			return $response
			->withHeader('content-type', 'application/json; charset=UTF-8')
			->withStatus(400);
	}
	
	try {
		
		$db = new Database();
		$conn = $db->connect();
		$sql = "INSERT INTO events ( label, datetime, location) VALUES (:label, :datetime, :location)";
		$stmt = $conn->prepare($sql);

		$stmt->bindParam(':label', $data['label']);
		$stmt->bindParam(':datetime', $data['datetime']);
		$stmt->bindParam(':location', $data['location']);
		$result = $stmt->execute();
		$stmt->closeCursor();

		$db = null;

		$response->getBody()->write(json_encode($data));
		return $response
		->withHeader('content-type', 'application/json; charset=UTF-8')
		->withStatus(200);
	} catch (PDOException $e) {
		$error = array(
		"message" => $e->getMessage()
		);

		$response->getBody()->write(json_encode($error));
		return $response
		->withHeader('content-type', 'application/json; charset=UTF-8')
		->withStatus(500);
	}
});


$app->run();