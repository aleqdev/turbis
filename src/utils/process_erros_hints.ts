import { AxiosResponse } from "axios"

export function process_error_hint(resp: AxiosResponse<any, any>): string {
  function map_hint(body: any): string {
    switch (body.code) {
      case "23503":
        const [[, target],, [, issue]] = body.message.matchAll(/"(.*?)"/g)!;

        switch ([target, issue].join('-')) {
          case "worker-hotel":
            return `Невозможно удалить контактное лицо, так как оно является управляющим отелем. Сначала обновите владельца отеля, а затем удалите контактное лицо.`

          case "worker_role-worker":
            return `Невозможно удалить роль, так как существуют сотрудники с данной ролью. Сначала обновите сотрудников с данной ролью, а затем удалите роль.`

          case "client_type-client":
            return `Невозможно удалить тип клиента, так как существуют клиенты с данным типом. Сначала обновите клинтов с данным типом, а затем удалите тип.`

          case "hotel-tour":
            return `Невозможно удалить данные об отеле, так как существуют туры с данным отелем. Сначала обновите туры с данным отелем, а затем удалите данные об отеле.`

          default:
            return "Один из объектов является ссылаемым из другой таблицы и не может быть удалён."
        }
        
      case "23514":
        const [[, check]] = body.message.matchAll(/"(.*?)"/g)!;

        switch (check) {
          case "phone_number_check":
            return `Введённый номер телефона не соответствует стандарту (Используйте только цифры, без знака "+", пробелов и скобок).`

          case "email_check":
            return `Введённая почта не соответствует стандарту.`

          default:
            return "Одно из полей набрано неправильно."
        }

      case "22001":
        return "Введённое поле больше максимума, отведённого для него."

      default:
        return JSON.stringify(body)
    }
  }

  return resp.status === 409 || resp.status == 400 ?
    map_hint(resp.data) :
    JSON.stringify(resp.data)
}