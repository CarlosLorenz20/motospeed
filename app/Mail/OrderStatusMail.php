<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Order $order) {}

    public function envelope(): Envelope
    {
        $num = str_pad($this->order->id, 6, '0', STR_PAD_LEFT);

        $subject = match ($this->order->status) {
            'approved'   => "✅ Pago confirmado — Orden #{$num}",
            'in_process' => "⏳ Pago en proceso — Orden #{$num}",
            'rejected'   => "❌ Pago rechazado — Orden #{$num}",
            default      => "Actualización de tu orden #{$num} — MotoSpeed",
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order-status');
    }
}
