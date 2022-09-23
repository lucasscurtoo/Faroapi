-- create user 'DBAdmin' identified by 'deC3JGy4Pu';
-- create user 'FaroUser';
-- grant select on FARO.* to 'FaroUser'@'%';
-- grant select, execute, delete, update on FARO.* to 'DBAdmin'@'%';
flush Privileges;

drop  database if exists FARO;
create database FARO;
use FARO;

create table CENTRE(
idCentre INT auto_increment primary key,
centreName varchar(250) not null unique,
free boolean not null,
addressStreet varchar(250) not null,
addressNumber int not null,
latitude double not null,
longitude double not null,
idSchoolarLevel int,
phoneNumber int
);

create table CAREER(
idCareer INT auto_increment primary key,
careerName varchar(250) not null unique,
careerDescription text not null,
degree varChar(250) not null,
duration varchar(50) not null
);

create table KEYWORD(
idKeyword int auto_increment primary key,
keyword varchar(50) unique not null
);

create table SCHEDULES(
idSchedule int auto_increment primary key,
centreSchedule varChar(20) unique not null
);

create table SCHOOLARLEVEL(
idSchoolarLevel int auto_increment primary key,
schoolarLevel varChar(20) unique not null
);

ALTER TABLE CENTRE
ADD FOREIGN KEY (idSchoolarLevel) REFERENCES SCHOOLARLEVEL(idSchoolarLevel);

create table CENTRE_CAREER(
idCentre int,
idCareer int,

primary key(idCentre, idCareer),
foreign key (idCentre) references CENTRE(idCentre),
foreign key (idCareer) references CAREER(idCareer)
);

create table CAREER_KEYWORD(
idCareer int,
idKeyword int,

primary key(idCareer,idKeyword),
foreign key (idCareer) references CAREER(idCareer),
foreign key (idKeyword) references KEYWORD(idKeyword)
);

create table CENTRE_SCHEDULES(
idCentre int,
idSchedule int,

primary key(idCentre, idSchedule),
foreign key (idCentre) references CENTRE(idCentre),
foreign key (idSchedule) references SCHEDULES(idSchedule)
);
use FARO;

select idCentre, centreName, free, addressStreet, addressNumber, latitude, longitude, phoneNumber, schoolarLevel, group_concat(centreSchedule) as schedules from centre natural join centre_schedules natural join schoolarlevel natural join SCHEDULES where idCentre=2;

/* ------------------------ Procedures ------------------------ */

delimiter //

Create procedure DBFiller_Career_VinculateKeyword(in keywordP varChar(50), idCareerP int)
Begin 
	DECLARE searchKeywordId INT default 0;
	set searchKeywordId = (select idKeyword from KEYWORD where keyword=keywordP);
    if searchKeywordId!=0 then
		insert into CAREER_KEYWORD values(idCareerP, searchKeywordId);
	else
		insert into KEYWORD(keyword) values(keywordP);
		set searchKeywordId = (select idKeyword from KEYWORD where keyword=keywordP);
		insert into CAREER_KEYWORD values(idCareerP, searchKeywordId);
	end if;
End	//
delimiter ;

delimiter //
Create procedure DBFiller_Centre_VinculateSchedules(in idCentreP int, scheduleP varChar(20))
Begin 
	DECLARE searchSchedule INT default 0;
	set searchSchedule = (select idSchedule from SCHEDULES where centreSchedule=scheduleP);
    if searchSchedule!=0 then
		insert into CENTRE_SCHEDULES values(idCentreP, searchSchedule);
	else
		insert into SCHEDULES(centreSchedule) values(scheduleP);
		set searchSchedule = (select idSchedule from SCHEDULES where centreSchedule=scheduleP);
		insert into CENTRE_SCHEDULES values(idCentreP, searchSchedule);
	end if;
End	//
delimiter ;

delimiter //
Create procedure DBFiller_Centre_VinculateSchoolarLevel(in idCentreP int, schoolarLevelP varChar(20))
Begin 
	DECLARE searchLevel INT default 0;
	set searchLevel = (select idSchoolarLevel from SCHOOLARLEVEL where schoolarLevel=schoolarLevelP);
    if searchLevel!=0 then
		update CENTRE set idSchoolarLevel=searchLevel where idCentre=idCentreP;
	else
		insert into SCHOOLARLEVEL(schoolarLevel) values(schoolarLevelP);
		set searchLevel = (select idSchoolarLevel from SCHOOLARLEVEL where schoolarLevel=schoolarLevelP);
		update CENTRE set idSchoolarLevel=searchLevel where idCentre=idCentreP;
	end if;
End	//
delimiter ;

delimiter //
Create procedure DBFiller_Centre_Delete(in idCentreP int)
Begin 
	delete from CENTRE_CAREER where idCentre=idCentreP;
    delete from CENTRE_SCHEDULES where idCentre=idCentreP;
	delete from CENTRE where idCentre= idCentreP;
End	//
delimiter ;

delimiter //
Create procedure DBFiller_Keywords_Clear(in idKeywordP int)
Begin 
	DECLARE vinculatedCareers INT default 0;
	set vinculatedCareers=(select count(idKeyword) as total from CAREER_KEYWORD where idKeyword=idKeywordP);
	if(vinculatedCareers=0)  then
		delete from KEYWORD where idKeyword=idKeywordP;
	end if;
	End	//
delimiter ;

delimiter //
Create procedure DBFiller_Career_DesvinculateCentre(in idCareerP int, idCentreP int)
Begin 
	DECLARE vinculatedCentres INT default 0;
	set vinculatedCentres=(select count(idCareer) as total from CENTRE_CAREER where idCareer=idCareerP);
	if(vinculatedCentres=1 OR vinculatedCentres=0)  then
		delete from CENTRE_CAREER where idCareer = idCareerP;
		delete from CAREER_KEYWORD where idCareer = idCareerP;
		delete from CAREER where idCareer = idCareerP;
	else
		delete from CENTRE_CAREER where idCentre = idCentreP and idCareer = idCareerP;
	end if;
End	//
delimiter ;

/* ------------------------ Fin Procedures ------------------------ */

/*---------------------------- Ejecutar en orden dado ----------------------------*/

insert into SCHOOLARLEVEL(schoolarLevel) values("Bachillerato");
insert into CENTRE values(idCentre,"Ánima",false, "Canelones",1162,-34.908812, -56.190687,1,29093640);
insert into SCHEDULES(centreSchedule) values("Completo");
insert into CENTRE_SCHEDULES values(1, 1);

insert into CAREER values(idCareer,"TIC","Su área principal es tiene la formación aquellas vinculadas a las líneas de desarrollo /programación, testing e infraestructura tecnológica.","Diseñador Web Junior","Tres años");
insert into KEYWORD(keyword) values("Informática");
insert into CAREER_KEYWORD values(1, 1);
insert into KEYWORD(keyword) values("Programación");
insert into CAREER_KEYWORD values(1, 2);
insert into KEYWORD(keyword) values("Tecnología");
insert into CAREER_KEYWORD values(1, 3);

insert into CAREER values(idCareer,"Administración","La Administración de Empresas es una ciencia social, económica y de carácter técnico. Tiene como objetivo principal lograr el máximo beneficio posible para una entidad. Logra esto mediante la organización, planificación, dirección y control de los recursos que tiene a su disposición.","Gerente de Empresas Junior","Tres años");
insert into KEYWORD(keyword) values("Administración");
insert into CAREER_KEYWORD values(2, 4);
insert into KEYWORD(keyword) values("Empresas");
insert into CAREER_KEYWORD values(2, 5);

insert into CENTRE_CAREER values(1,1);
insert into CENTRE_CAREER values(1,2);

insert into SCHOOLARLEVEL(schoolarLevel) values("Universidad");
insert into CENTRE values(idCentre,"ORT Pocitos",false,"Blvr. España",2633,-34.912562, -56.156688,2,29021505);
insert into SCHEDULES(centreSchedule) values("Matutino");
insert into SCHEDULES(centreSchedule) values("Vespertino");
insert into SCHEDULES(centreSchedule) values("Nocturno");
insert into CENTRE_SCHEDULES values(2, 2);
insert into CENTRE_SCHEDULES values(2, 3);
insert into CENTRE_SCHEDULES values(2, 4);

insert into CAREER values(idCareer,"Licenciatura en Diaseño, Arte y Tecnologia","Esta propuesta, transversal e integral, está articulada por proyectos artísticos y expresivos que incrementan sus niveles de complejidad a partir de la asimilación de herramientas metodológicas y recursos tecnológicos por parte de los alumnos, adecuados a las múltiples posibilidades y desafíos de esta época.","Licenciado/a en Diaseño, Arte y Tecnologia","Cuatro años");
insert into CAREER values(idCareer,"Ingeniería en sistemas","La carrera Ingeniería en Sistemas te permitirá desarrollarte como creador de software y te brindará las herramientas para construir soluciones innovadoras en uno de los sectores con mayor demanda en Uruguay y en el mundo.","Ingeniero en Sistemas","Cinco años");
insert into KEYWORD(keyword) values("Arte");
insert into CAREER_KEYWORD values(3, 6);
insert into CAREER_KEYWORD values(3, 3);
insert into KEYWORD(keyword) values("Ingenierìa");
insert into CAREER_KEYWORD values(4, 7);
insert into CAREER_KEYWORD values(4, 2);

insert into CENTRE_CAREER values(2,3);
insert into CENTRE_CAREER values(2,4);

select idCentre, centreName, free, addressStreet, addressNumber, latitude, longitude, phoneNumber, schoolarLevel, group_concat(centreSchedule) as centreSchedules from centre natural left join centre_schedules natural left join schoolarlevel natural left join SCHEDULES where idCentre=1;
select idCareer from CENTRE_CAREER where idCentre=1;
select careerName from CAREER where idCareer=1;
select keyword from keyword where idKeyword=1;
/*---------------------------- Ejemplos usando los stored procedures ----------------------------*/

insert into CENTRE values(idCentre,"I.T.S",true,"Bv José Battle y Ordoñez y Gral Flores",3705,-34.861812,-56.169187,1,22159848);

insert into CAREER values(idCareer,"MECÁNICA AUTOMOTRIZ","El estudiante será capaz de reparar y ajustar motores encendidos por chispa y motores diésel y aplicar conocimientos técnico-tecnológicos utilizando e interpretando los manuales y datos del fabricante en el armado del motor y sistemas periféricos.","Mecánico automotríz","Tres años");
call DBFiller_Centre_VinculateSchoolarLevel(3, "Bachillerato");
call DBFiller_Centre_VinculateSchedules(3,"Matutino");
call DBFiller_Centre_VinculateSchedules(3,"Vespertino");
call DBFiller_Centre_VinculateSchedules(3,"Nocturno");
call DBFiller_Career_VinculateKeyword("Autos",5);
call DBFiller_Career_VinculateKeyword("Mecánica",5);
call DBFiller_Career_VinculateKeyword("Motores",5);

insert into CAREER values(idCareer,"Gastronomía","El estudiante será capaz de Operar los diferentes equipos, instrumentos, máquinas y herramientas, para el desarrollo de la profesión y aplicar técnicas de producción y de servicios, considerando los aspectos higiénicos-sanitarios, socio-ambientales e histórico - culturales.","Técnico en Gastronomía","Dos años");
call DBFiller_Career_VinculateKeyword("Cocina",6);
call DBFiller_Career_VinculateKeyword("Comida",6);
call DBFiller_Career_VinculateKeyword("Gastronomía",6);

insert into CAREER values(idCareer,"Técnico Forestal","Conocer y supervisar  ética y profesionalmente el desarrollo de las tareas de manejo de viveros forestales, producción de plantines, implantación de montes y sus cuidados post-plantación, manejo, medición y explotación de bosques forestales, garantizando que se realicen con calidad y en forma segura para los trabajadores y el medio ambiente, generando el menor impacto ambiental posible","Técnico Forestal","Dos años");
call DBFiller_Career_VinculateKeyword("Árboles",6);
call DBFiller_Career_VinculateKeyword("Botánica",6);
call DBFiller_Career_VinculateKeyword("Silvicultura",6);

insert into CENTRE_CAREER values(3,5);
insert into CENTRE_CAREER values(3,6);