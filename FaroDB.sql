/*create user 'admin' identified by 'deC3JGy4Pu';
grant all privileges on *.* to 'admin'@'%' with grant option;*/
drop database FARO;
create database FARO;
use FARO;

create table CENTRE(
id_centre INT auto_increment,
centre_name varchar(250) not null unique,
free boolean not null,
latitude int not null,
longitude int not null,
centre_schedule varchar(50),
phoneNumber int,

primary key(id_centre)
);

create table CAREER(
id_career INT auto_increment,
career_name varchar(250) not null unique,
career_description text,
grade varchar(250),
duration varchar(50),

primary key(id_career)
);

create table KEYWORD(
id_keyword int auto_increment,
keyword varchar(50) unique,

primary key(id_keyword)
);

create table CENTRE_CAREER(
id_centre int,
id_career int,

primary key(id_career,id_centre),
foreign key (id_career) references CAREER(id_career),
foreign key (id_centre) references CENTRE(id_centre)
);

create table CAREER_KEYWORD(
id_career int,
id_keyword int,

primary key(id_career,id_keyword),
foreign key (id_career) references CAREER(id_career),
foreign key (id_keyword) references KEYWORD(id_keyword)
);

delimiter //
Create procedure vin_career_keyword(in keyword_a varChar(50), id_career int)
Begin 
	DECLARE keyword_id  INT default 0;
	set keyword_id = (select id_keyword from KEYWORD where keyword=keyword_a);
    if keyword_id!=0 then
		insert into CAREER_KEYWORD (id_career,id_keyword) values (id_career, keyword_id);
	else
		insert into KEYWORD (keyword)values(keyword_a);
		set keyword_id = (select id_keyword from KEYWORD where keyword=keyword_a);
		insert into CAREER_KEYWORD (id_career,id_keyword) values (id_career, keyword_id);
	end if;
End	//
delimiter ;

select id_keyword from KEYWORD where keyword='palabra21';

select * from CAREER natural join CENTRE_CAREER where id_centre=1;

update centre set centre_name="Centro especial 111" where id_centre=2;

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