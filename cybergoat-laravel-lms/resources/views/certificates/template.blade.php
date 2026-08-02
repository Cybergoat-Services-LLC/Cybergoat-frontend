<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Helvetica', sans-serif;
            margin: 0;
            padding: 60px 70px;
            border: 12px solid #0A0F1A;
            box-sizing: border-box;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .brand { font-size: 22px; font-weight: bold; color: #0A0F1A; letter-spacing: 2px; }
        .subbrand { font-size: 11px; color: #555; margin-top: 4px; }
        .title { text-align: center; font-size: 30px; font-weight: bold; margin: 40px 0 10px; color: #0A0F1A; }
        .subtitle { text-align: center; font-size: 13px; color: #555; margin-bottom: 40px; }
        .recipient { text-align: center; font-size: 26px; font-weight: bold; margin: 20px 0; color: #2F57EF; }
        .course-title { text-align: center; font-size: 18px; margin: 10px 0 30px; }
        .meta-table { width: 100%; margin-top: 50px; font-size: 11px; color: #333; }
        .meta-table td { padding: 4px 0; }
        .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #888; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">CYBERGOAT SERVICES LLC</div>
        <div class="subbrand">Dubai Silicon Oasis, UAE &middot; {{ $certificate->issuer_name }}</div>
    </div>

    <div class="title">Certificate of Completion</div>
    <div class="subtitle">{{ $certificate->title }}</div>

    <div class="recipient">{{ $certificate->user->name }}</div>
    <div class="course-title">has successfully completed &mdash; {{ $certificate->course->title }}</div>

    <table class="meta-table">
        <tr>
            <td><strong>Certificate Number:</strong> {{ $certificate->certificate_number }}</td>
            <td style="text-align: right;"><strong>Issued:</strong> {{ $certificate->issued_at->format('d F Y') }}</td>
        </tr>
    </table>

    <div class="footer">
        Verify this certificate's authenticity at cybergoat.ae/verify/{{ $certificate->certificate_number }}
    </div>
</body>
</html>
