import type { CurrentClient } from "../client.type";

export function sendClientTrackingInfo(client: CurrentClient) {
    const trackingUrl = `${client.academy.profileTrackingUrl}/${client.id}`;

    const message = `عزيزي/عزيزتي ${client.name}،

تم إنشاء رابط خاص لمتابعة ملفك في أكاديمية ${client.academy.name}.

رابط المتابعة:
${trackingUrl}

من خلال هذا الرابط يمكنك الاطلاع على حالة ملفك وأحدث التحديثات المتعلقة به.

مع أطيب التمنيات بالتوفيق،
إدارة أكاديمية ${client.academy.name}`;

    const phone = `2${client.phone.replace(/\D/g, "")}`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
}