<?php

namespace App\Model;

use \PDO;

class Database
{
    private $host = 'db';
    private $user = 'root';
    private $pass = 'root';
    private $dbname = 'familynote';

    public function connect()
    {
        $conn_str = "mysql:host=$this->host;dbname=$this->dbname;charset=UTF8";
        $conn = new PDO($conn_str, $this->user, $this->pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $conn;
    }
}