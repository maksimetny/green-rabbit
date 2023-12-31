# Тестовое задание на должность "Разработчик NodeJS"

В рамках выполнения тестового задания требуется разработать механизм асинхронной обработки HTTP
запросов и опубликовать исходники проекта на Github для дальнейшего анализа и проверки.

Время на выполнения задания: 3 дня.

Требования:

- [x] Требуется разработать механизм асинхронной обработки HTTP запросов
- [x] Требуется использовать стек NodeJS, RabbitMQ
- [x] Требуется оформить в виде репозитория на Github
- [x] Требуется приложить инструкцию по локальному развертыванию проекта
- [x] Требуется реализовать логирование для целей отладки и мониторинга
- [x] Требуется разработать микросервис М1 для обработки входящих HTTP запросов
- [x] Требуется разработать микросервис М2 для обработки заданий из RabbitMQ
- [x] Требуется имитировать задержку обработки задания продолжительностью 5 секунд
- [x] Требуется на вход системы подавать числовой параметр, а в качестве ответа получать удвоенное значение переданного параметра. Например, при передаче числа 5 ожидается получить в ответ число 10
- [ ] Требуется опубликовать разработанный сервис в Интернете для приема входящих POST запросов
(желательно)

Алгоритм работы:

- Отправляем HTTP POST запрос на заданный URL
- Получаем HTTP запрос на уровне микросервиса М1
- Транслируем HTTP запрос в очередь RabbitMQ. Запрос трансформируется в задание
- Обрабатываем задание микросервисом М2 из очереди RabbitMQ в течение 5 секунд
- Помещаем результат обработки задания в RabbitMQ
- Возвращаем результат HTTP запроса как результат выполнения задания из RabbitMQ

Принципиальная схема:

```mermaid
flowchart TD
	D(Пользователь) -->|HTTP запрос| A[M1] <--> C(RabbitMQ) <--> B[M2]
```
