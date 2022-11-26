import { useIonAlert } from "@ionic/react";

export default function presentNoAuthAlert(presentAlert: ReturnType<typeof useIonAlert>[0]) {
  presentAlert({
    header: "Ошибка авторизации",
    buttons: ["Ок"]
  });
}