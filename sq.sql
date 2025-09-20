CREATE TABLE user_survey_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    isRead2Earn Boolean Default false,
	doBookAfterRead TEXT NOT NULL,
    dailyHours TEXT NOT NULL,
    genres TEXT NOT NULL,
  	postReview Boolean Default false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN isUserSurvey BOOLEAN DEFAULT FALSE;

ALTER TABLE user_survey_responses ADD COLUMN userId VARCHAR(255) DEFAULT NULL;



-- //Collection

insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (0, '[\"57e656d8-9ef5-11ed-b1d3-42010aa00006\",\"684a853b-9ba1-11ed-b1d3-42010aa00006\",\"8368de24-9e03-11ed-b1d3-42010aa00006\"]', NULL, '2022-04-26 03:05:00', 0, '10f4d0a9-76e9-4e12-a8fc-54a517e6b390', 'expert picks', 2);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (1, NULL, '{\"key\":\"published\", \"value\":\"\"}', '2022-04-26 03:05:00', 0, '503fa04a-7469-4072-9a53-35f0929c8a86', 'new releases', 1);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (1, '[\"57e656d8-9ef5-11ed-b1d3-42010aa00006\",\"684a853b-9ba1-11ed-b1d3-42010aa00006\",\"8368de24-9e03-11ed-b1d3-42010aa00006\"]', NULL, '2022-04-26 03:05:00', 1, '6536dd15-0b1d-4727-aecb-4ed48551abbd', 'highlight', 0);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (1, NULL, '{\"key\":\"price\", \"value\":\"\"}', '2024-05-19 06:04:40', 0, '6f4d0a9-66e9-4e32-a8fc-64a517e6b390', 'under $5', 7);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (1, NULL, '{\"key\":\"rating\", \"value\":\"\"}', '2022-04-26 03:05:00', 0, '73cf72b3-ec16-4964-8625-e951ead58ef5', 'highest rated', 5);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (1, NULL, '{\"key\":\"copies\", \"value\":\"\"}', '2022-04-26 03:05:00', 0, '99c85e01-1768-4588-b2e9-13dae2448221', 'best selling', 4);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (0, '[\"57e656d8-9ef5-11ed-b1d3-42010aa00006\",\"684a853b-9ba1-11ed-b1d3-42010aa00006\",\"8368de24-9e03-11ed-b1d3-42010aa00006\"]', NULL, '2022-04-26 03:05:00', 0, 'e745d181-80e5-498c-a0d3-3b74498d2879', 'award winning', 3);
insert into `collections` (`active`, `books`, `books_filter`, `created_at`, `highlight`, `id`, `name`, `order`) values (0, NULL, '{\"key\":\"likes\", \"value\":\"\"}', '2022-04-26 03:05:00', 0, 'ebcda60c-b4ef-4a15-bc2c-25180aa0b732', 'most liked', 6);


