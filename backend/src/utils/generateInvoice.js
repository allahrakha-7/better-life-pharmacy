export const generateInvoiceHtml = (order) => {
    const itemsRows = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #334155;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #475569;">Rs. ${item.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold; color: #0f172a;">Rs. ${item.price * item.quantity}</td>
        </tr>
    `).join('');

    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 20px; color: #334155; background-color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #006a4e; padding-bottom: 20px;">
            <div>
                <h1 style="color: #006a4e; margin: 0; font-size: 24px; font-weight: 800;">Better Life Pharmacy</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Authentic Care & Wellness Supplies</p>
            </div>
            <div style="text-align: right;">
                <h3 style="margin: 0; color: #1e293b;">INVOICE</h3>
                <p style="margin: 5px 0 0 0; font-size: 11px; font-family: monospace; color: #64748b; font-weight: bold;">ID: ${order.orderId}</p>
            </div>
        </div>
        
        <div style="margin: 25px 0; font-size: 12px; line-height: 1.6;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <strong style="color: #006a4e;">Billed To:</strong><br>
                        ${order.name}<br>
                        ${order.address}, ${order.city}<br>
                        Phone: ${order.phone}
                    </td>
                    <td style="width: 50%; vertical-align: top; text-align: right;">
                        <strong style="color: #006a4e;">Order Details:</strong><br>
                        Date: ${new Date(order.createdAt).toLocaleDateString()}<br>
                        Payment: ${order.paymentMethod.toUpperCase()}<br>
                        Status: ${order.status}
                    </td>
                </tr>
            </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f8fafc; color: #64748b; font-weight: bold; text-align: left;">
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Item</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center;">Qty</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right;">Price</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
        </table>

        <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px;">
            <table style="width: 50%; margin-left: auto; border-collapse: collapse;">
                <tr>
                    <td style="padding: 5px 0; color: #64748b;">Subtotal:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: bold;">Rs. ${order.subtotal}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #64748b;">Shipping:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: bold;">Rs. ${order.shipping}</td>
                </tr>
                <tr style="border-top: 2px solid #006a4e;">
                    <td style="padding: 10px 0 0 0; font-size: 14px; font-weight: bold; color: #006a4e;">Total Amount:</td>
                    <td style="padding: 10px 0 0 0; text-align: right; font-size: 14px; font-weight: bold; color: #006a4e;">Rs. ${order.total}</td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
            <p style="margin: 0; font-weight: bold;">Thank you for choosing Better Life Pharmacy!</p>
            <p style="margin: 3px 0 0 0;">For queries, call our 24/7 Helpline: 0800-BETTER-LIFE</p>
        </div>
    </div>
    `;
};
