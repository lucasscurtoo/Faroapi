-- create user 'DBAdmin' identified by 'deC3JGy4Pu';
grant select, execute, delete, update on FARO.* to 'DBAdmin'@'%';
FLUSH Privileges;
SHOW grants for 'DBAdmin'@'%';

drop database FARO;
create database FARO;
use FARO;

create table CENTRE(
idCentre INT auto_increment,
centreName varchar(250) not null unique,
free boolean not null,
addressStreet varchar(250) not null,
addressNumber int not null,
latitude double not null,
longitude double not null,
schoolarLevel varchar(50) not null,
phoneNumber int,

primary key(idCentre)
);

create table CAREER(
idCareer INT auto_increment,
careerName varchar(250) not null unique,
careerDescription text,
degree varChar(250),
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

primary key(idCentre, idCareer),
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

create table CENTRE_SCHEDULE(
idCentre int,
centreSchedule varChar(20),

primary key(idCentre, centreSchedule),
foreign key (idCentre) references CENTRE(idCentre)
);

delimiter //
Create procedure vin_career_keyword(in keywordP varChar(50), idCareerP int)
Begin 
	DECLARE searchKeywordId INT default 0;
	set searchKeywordId = (select idKeyword from KEYWORD where keyword=keywordP);
    if searchKeywordId!=0 then
		insert into CAREER_KEYWORD (idCareer,idKeyword) values (idCareerP, searchKeywordId);
	else
		insert into KEYWORD(keyword) values(keywordP);
		set searchKeywordId = (select idKeyword from KEYWORD where keyword=keywordP);
		insert into CAREER_KEYWORD (idCareer,idKeyword) values (idCareerP, searchKeywordId);
	end if;
End	//
delimiter ;

delimiter //
Create procedure deleteCentre(idCentreP int)
Begin 
	delete from CENTRE_CAREER where idCentre = idCentreP;
	delete from CENTRE where idCentre= idCentreP;
End	//
delimiter ;

delimiter //
Create procedure deleteCareer(idCareerP int)
Begin 
	delete from CENTRE_CAREER where idCareer = idCareerP;
	delete from CAREER_KEYWORD where idCareer = idCareerP;
	delete from CAREER where idCareer= idCareerP;
End	//
delimiter ;

/*---------------------------- Ejecutar en orden dado ----------------------------*/

/*
insert into CENTRE values(idCentre,"Ánima",false, "Canelones",1162,-34.908812, -56.190687,"Bachillerato",29093640);
insert into CAREER values(idCareer,"TIC","Su área principal es tiene la formación aquellas vinculadas a las líneas de desarrollo /programación, testing e infraestructura tecnológica.","Diseñador Web Junior","Tres años");
insert into CENTRE_SCHEDULE values(1,4);
select * from career;
call vin_career_keyword("Informática",1);
call vin_career_keyword("Programación",1);
call vin_career_keyword("Tecnología",1);
insert into CAREER values(idCareer,"Administración","La Administración de Empresas es una ciencia social, económica y de carácter técnico. Tiene como objetivo principal lograr el máximo beneficio posible para una entidad. Logra esto mediante la organización, planificación, dirección y control de los recursos que tiene a su disposición.","Gerente de Empresas Junior","Tres años");
call vin_career_keyword("Administración",2);
call vin_career_keyword("Empresas",2);
insert into CENTRE_CAREER values(1,1);
insert into CENTRE_CAREER values(1,2);

insert into CENTRE values(idCentre,"ORT Pocitos",false,"Blvr. España",2633,-34.912562, -56.156688, "Matutino, Vespertino y Nocturno","Universidad",29021505);
insert into CAREER values(idCareer,"Licenciatura en Diseño Industrial","La curiosidad, la creatividad y el ingenio son característicos de la personalidad de un diseñador industrial, capacidades que se aprenden y se desarrollan.","Licenciado en Diseño Industrial","Cuatro años");
insert into CENTRE_SCHEDULE values(2,1);
insert into CENTRE_SCHEDULE values(2,2);
insert into CENTRE_SCHEDULE values(2,3);

call vin_career_keyword("Diseño",3);
call vin_career_keyword("Dibujo",3);
call vin_career_keyword("Expresión",3);
insert into CAREER values(idCareer,"Ingeniería en sistemas","La carrera Ingeniería en Sistemas te permitirá desarrollarte como creador de software y te brindará las herramientas para construir soluciones innovadoras en uno de los sectores con mayor demanda en Uruguay y en el mundo.","Ingeniero en Sistemas","Cinco años");
call vin_career_keyword("Ingeniería",4);
call vin_career_keyword("Ciencia",4);
insert into CENTRE_CAREER values(2,3);
insert into CENTRE_CAREER values(2,4);*/