
export function process_error_hint(body: any): string {
  function map_hint(body: any): string {
    switch (body.error_hint) {
      case "existing_relation":
        switch ([body.target, body.issue].join('-')) {
          case "worker-hotel":
            return `Невозможно удалить контактное лицо, так как оно является управляющим отелем. Сначала обновите владельца отеля, а затем удалите контактное лицо.`

          default:
            return "Один из объектов является ссылаемым из другой таблицы и не может быть удалён."
        }
    
      default:
        return "Неизвестная ошибка"
    }
  }

  return body.error_hint !== undefined ?
    map_hint(body) :
    JSON.stringify(body)
}