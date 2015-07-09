DROP PROCEDURE IF EXISTS GetAllInventory;

DELIMITER $$
CREATE PROCEDURE GetAllInventory()
BEGIN

select s4.*, s5.LastRunID as LastRunID, IFNULL(s5.InitialQuantity,0) as LastRunInitialQuantity
from(
select p.ProductID, p.Name as ProductName,
IFNULL(sum(r.QuantityAvailable),0) as TotalQuantityAvailable,
max(r.DateCreated) as LastRunDate
from Products p
left join Piles pl on pl.ProductID = p.ProductID
left join Runs r on pl.PileID = r.PileID
where p.ViewOption != 0
group by p.ProductID) as s4

left join

(select s3.ProductID,s3.LastRunID,r3.InitialQuantity,r3.DateCreated
from(
select s2.ProductID, max(s1.RunID) as LastRunID
from (select * from Runs natural join Piles)
as s1
join
(Select max(DateCreated) as LastRunDate,p2.ProductID
from Runs r2
natural join Piles p2
group by p2.ProductID) as s2
on s1.DateCreated=s2.LastRunDate and s1.ProductID=s2.ProductID
group by ProductID) as s3
join Runs r3 on r3.RunID=s3.LastRunID) as s5

on s4.ProductID = s5.ProductID;



END $$

DELIMITER ;