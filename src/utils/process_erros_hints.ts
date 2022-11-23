
export function process_error_hint(body: any): string {
  function map_hint(body: any): string {
    switch (body.error_hint) {
      case "existing_relation":
        switch ([body.target, body.issue].join('-')) {
          case "worker-hotel":
            return `Невозможно удалить контактное лицо, так как оно является управляющим отелем. Сначала обновите владельца отеля, а затем удалите контактное лицо.`

          case "worker_role-worker":
            return `Невозможно удалить роль, так как существуют сотрудники с данной ролью. Сначала обновите сотрудников с данной ролью, а затем удалите роль.`

          default:
            return "Один из объектов является ссылаемым из другой таблицы и не может быть удалён."
        }

        case "check_violation":
          switch (body.check) {
            case "phone_number_check":
              return `Введённый номер телефона не соответствует стандарту. (Используйте только цифры, без знака "+", пробелов и скобок)`

            case "email_check":
              return `Введённая почта не соответствует стандарту.`

            default:
              return "Одно из полей набрано неправильно."
          }
      
      default:
        return "Неизвестная ошибка"
    }
  }

  return body.error_hint !== undefined ?
    map_hint(body) :
    JSON.stringify(body)
}