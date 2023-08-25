<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Event;

use App\Domain\Event\Event;
use App\Domain\Event\EventNotFoundException;
use App\Domain\Event\EventRepository;

class InMemoryEventRepository implements EventRepository
{
    /**
     * @var Event[]
     */
    private array $events;

    /**
     * @param Event[]|null $events
     */
    public function __construct(array $events = null)
    {
        $this->events = $events ?? [
            1 => new Event(1, 'Anniversaire Gabriel', '2015/11/01', 'Rennes'),
            2 => new Event(2, 'Anniversaire Matiss', '2008/12/31', 'Caen'),
            3 => new Event(3, 'Cousinade', '2023/08/26', 'Cerisy-belle-étoile'),
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function findAll(): array
    {
        return array_values($this->events);
    }

    /**
     * {@inheritdoc}
     */
    public function findEventOfId(int $id): Event
    {
        if (!isset($this->events[$id])) {
            throw new EventNotFoundException();
        }

        return $this->events[$id];
    }
}
