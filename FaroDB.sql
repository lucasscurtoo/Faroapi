-- create user 'DBAdmin' identified by 'deC3JGy4Pu';
-- grant select, insert, update, delete on FARO.* to 'DBAdmin'@'%';
drop database FARO;
create database FARO;
use FARO;

create table CENTRE(
idCentre INT auto_increment,
centreName varchar(250) not null unique,
free boolean not null,
latitude double not null,
longitude double not null,
centreSchedule varchar(50),
phoneNumber int,

primary key(idCentre)
);

create table CAREER(
idCareer INT auto_increment,
careerName varchar(250) not null unique,
careerDescription text,
grade varchar(250),
duration varchar(50),

primary key(idCareer)
);

create table KEYWORD(
idKeyword int auto_increment,
keyword varchar(50) unique,

primary key(idKeyword)
);

create table CENTRE_CAREER(
idCentre int,
idCareer int,

primary key(idCareer,idCentre),
foreign key (idCareer) references CAREER(idCareer),
foreign key (idCentre) references CENTRE(idCentre)
);

create table CAREER_KEYWORD(
idCareer int,
idKeyword int,

primary key(idCareer,idKeyword),
foreign key (idCareer) references CAREER(idCareer),
foreign key (idKeyword) references KEYWORD(idKeyword)
);

delimiter //
Create procedure vin_career_keyword(in keyword_k varChar(50), idCareer int)
Begin 
	DECLARE searchKeywordId INT default 0;
	set searchKeywordId = (select idKeyword from KEYWORD where keyword=keyword_k);
    if searchKeywordId!=0 then
		insert into CAREER_KEYWORD (idCareer,idKeyword) values (idCareer, searchKeywordId);
	else
		insert into KEYWORD (keyword)values(keyword_k);
		set searchKeywordId = (select idKeyword from KEYWORD where keyword=keyword_k);
		insert into CAREER_KEYWORD (idCareer,idKeyword) values (idCareer, searchKeywordId);
	end if;
End	//
delimiter ;

insert into CENTRE(idCentre,centreName,free,latitude,longitude,centreSchedule,phoneNumber)values(idCentre,"Ánima",false, -34.908812, -56.190687, "Completo",29093640);
insert into CAREER(idCareer, careerName,careerDescription,grade,duration) values(idCareer,"TIC","Su área principal es tiene la formación aquellas vinculadas a las líneas de desarrollo /programación, testing e infraestructura tecnológica.","Diseñador Web Junior","Tres años");
select * from career;
call vin_career_keyword("Informática",1);
call vin_career_keyword("Programación",1);
call vin_career_keyword("Tecnología",1);
insert into CAREER(idCareer, careerName,careerDescription,grade,duration) values(idCareer,"Administración","La Administración de Empresas es una ciencia social, económica y de carácter técnico. Tiene como objetivo principal lograr el máximo beneficio posible para una entidad. Logra esto mediante la organización, planificación, dirección y control de los recursos que tiene a su disposición.","Gerente de Empresas Junior","Tres años");
call vin_career_keyword("Administración",2);
call vin_career_keyword("Empresas",2);
insert into CENTRE_CAREER values(1,1);
insert into CENTRE_CAREER values(1,2);

insert into CENTRE(idCentre,centreName,free,latitude,longitude,centreSchedule,phoneNumber)values(idCentre,"ORT Pocitos",false, -34.912562, -56.156688, "Matutino, Vespertino y Nocturno",29021505);
insert into CAREER(idCareer, careerName,careerDescription,grade,duration) values(idCareer,"Licenciatura en Diseño Industrial","La curiosidad, la creatividad y el ingenio son característicos de la personalidad de un diseñador industrial, capacidades que se aprenden y se desarrollan.","Licenciado en Diseño Industrial","Cuatro años");
select * from career;
select * from centre;
call vin_career_keyword("Diseño",3);
call vin_career_keyword("Dibujo",3);
call vin_career_keyword("Expresión",3);
insert into CAREER(idCareer, careerName,careerDescription,grade,duration) values(idCareer,"Ingeniería en sistemas","La carrera Ingeniería en Sistemas te permitirá desarrollarte como creador de software y te brindará las herramientas para construir soluciones innovadoras en uno de los sectores con mayor demanda en Uruguay y en el mundo.","Ingeniero en Sistemas","Cinco años");
call vin_career_keyword("Ingeniería",4);
call vin_career_keyword("Ciencia",4);
insert into CENTRE_CAREER values(1,3);
insert into CENTRE_CAREER values(1,4);

/*
update centre set centre_name="Centro especialito" where id_centre=29;
select * from career;
select * from centre;
select * from keyword;
select * from career_keyword;
select * from centre_career;

/*
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE CENTRE;
TRUNCATE TABLE career;
TRUNCATE TABLE keyword;
SET FOREIGN_KEY_CHECKS = 1;
SHOW TABLES;*/