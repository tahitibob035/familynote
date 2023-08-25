<?php

declare(strict_types=1);

namespace App\Domain\Event;

use JsonSerializable;

class Event implements JsonSerializable
{
    private ?int $id;

    private string $description;

    private string $timestamp;

    private string $location;

    public function __construct(?int $id, string $description, string $timestamp, string $location)
    {
        $this->id = $id;
        $this->description = strtolower($description);
        $this->timestamp = ucfirst($timestamp);
        $this->location = ucfirst($location);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEventDescription(): string
    {
        return $this->description;
    }

    public function getTimestamp(): string
    {
        return $this->timestamp;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'timestamp' => $this->timestamp,
            'location' => $this->location,
        ];
    }
}
