<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your IP.</title>

    <style>
        body {
            font-size: 5em;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
    </style>

</head>
<body>
    <?php
    echo $ip = $_SERVER['REMOTE_ADDR'];
    ?>
</body>
</html>