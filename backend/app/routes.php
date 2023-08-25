<?php

declare(strict_types=1);

use App\Application\Actions\User\ListUsersAction;
use App\Application\Actions\User\ViewUserAction;
use App\Application\Actions\Event\ListEventsAction;
use App\Application\Actions\Event\ViewEventAction;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    // $app->get('/', function (Request $request, Response $response) {
    //     $response->getBody()->write('Hello world!');
    //     return $response;
    // });

    $app->get('/', function (Request $request, Response $response) {
        return $response->withStatus(302)->withHeader('Location', 'index.html');
    });

    $app->group('/api/users', function (Group $group) {
        $group->get('', ListUsersAction::class);
        $group->get('/{id}', ViewUserAction::class);
    });
    $app->group('/api/events', function (Group $group) {
        $group->get('', ListEventsAction::class);
        $group->get('/{id}', ViewEventAction::class);
    });
};
