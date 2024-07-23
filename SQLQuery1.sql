select count(*) from MatierUsedFabrications where IDSociete=1

select * from Societes

UPDATE MatierUsedFabrications SET IDSociete = 1 WHERE IDSociete = 2;


SELECT COUNT(*) AS total
FROM MatierUsedFabrications u
JOIN SubCategoryMatierPremiers s ON u.idsubcategory = s.idsubcategory
JOIN MatierPremiers c ON s.IdMatierPremier = c.Id
WHERE c.CategoryName = 'colorant' and iDSociete=2 ;

select sum(quantite) from achats 
select * from achats