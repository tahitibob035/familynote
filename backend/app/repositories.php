<?php

declare(strict_types=1);

use App\Domain\User\UserRepository;
use App\Domain\Event\EventRepository;
use App\Infrastructure\Persistence\User\InMemoryUserRepository;
use App\Infrastructure\Persistence\Event\InMemoryEventRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    // Here we map ours repositories interface to its in memory implementation
    $containerBuilder->addDefinitions([
        UserRepository::class => \DI\autowire(InMemoryUserRepository::class),
        EventRepository::class => \DI\autowire(InMemoryEventRepository::class),
    ]);
};
