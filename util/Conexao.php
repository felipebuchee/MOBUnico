<?php

class Conexao
{
    private static $conn = null;

    public static function getConexao()
    {
        if (self::$conn == null) {
            $opcoes = array(
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            );

            self::$conn = new PDO(
                "mysql:host=localhost:3306;dbname=minecraft_db",
                "felipe",
                "bancodedados",
                $opcoes
            );
        }   

        return self::$conn;
    }
}