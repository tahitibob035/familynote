<?php

declare(strict_types=1);

namespace App\Domain\Event;

interface EventRepository
{
    /**
     * @return Event[]
     */
    public function findAll(): array;

    /**
     * @param int $id
     * @return Event
     * @throws EventNotFoundException
     */
    public function findEventOfId(int $id): Event;
}
