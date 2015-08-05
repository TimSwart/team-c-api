DROP PROCEDURE IF EXISTS EditUserByUsername;

DELIMITER $$
CREATE PROCEDURE EditUserByUsername
(IN _username varchar(255), IN _firstname varchar(255), IN _lastname varchar(255), IN _permissions int, IN _confirmation bit(1))

BEGIN

UPDATE Users
SET FirstName = _firstname, LastName = _lastname, PermsID = _permissions, IsConfirmed = _confirmation
WHERE Username = _username;
END $$

DELIMITER ;