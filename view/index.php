<?php

require_once("../util/Conexao.php");

$con = Conexao::getConexao();

// Busca mobs existentes no banco
$sql = "SELECT * FROM mobs";
$stm = $con->prepare($sql);
$stm->execute();
$mobs = $stm->fetchAll();

$nome = "";
$tipo = "";
$dificuldade = "";
$versao = "";
$imagem = "";
$msgErro = "";

if ($_POST) {
    // Obtém dados do formulário
    $nome = trim($_POST["nome"]);
    $tipo = $_POST["tipo"];
    $dificuldade = $_POST["dificuldade"];
    $versao = trim($_POST["versao"]);
    $imagem = trim($_POST["imagem"]);

    $erros = [];

    // Validação do nome
    if (!$nome) {
        array_push($erros, "Informe o nome do mob.");
    } elseif (strlen($nome) < 3 || strlen($nome) > 50) {
        array_push($erros, "O nome do mob deve ter entre 3 e 50 caracteres.");
    } else {
        // Verifica se nome já existe
        $sql = "SELECT * FROM mobs WHERE nome = ?";
        $stm = $con->prepare($sql);
        $stm->execute([$nome]);
        $resultado = $stm->fetchAll();

        if (count($resultado) > 0) {
            array_push($erros, "Já existe um mob com esse nome.");
        }
    }

    // Validação do tipo
    if (!$tipo || !in_array($tipo, ['P', 'M', 'A', 'R', 'I', 'C'])) {
        array_push($erros, "Tipo inválido. Selecione uma das opções: Passivo, Morto-vivo, Aquático, Artrópode, Illager ou Chefe.");
    }

    // Validação da dificuldade
    if (!$dificuldade || !in_array($dificuldade, ['F', 'M', 'D', 'B'])) {
        array_push($erros, "Dificuldade inválida. Selecione uma das opções: Fácil, Médio, Difícil ou Boss.");
    }

    // Validação da versão
    if (!$versao || strlen($versao) > 10) {
        array_push($erros, "Informe a versão do Minecraft onde o mob foi adicionado (máx. 10 caracteres).");
    }

    // Validação da imagem
    if (!$imagem) {
        array_push($erros, "Informe a URL da imagem do mob.");
    } elseif (strlen($imagem) > 500) {
        array_push($erros, "A URL da imagem deve ter no máximo 255 caracteres.");
    }

    // Insere no banco se não houver erros
    if (count($erros) === 0) {
        // Insere o novo mob no banco
        $sql = "INSERT INTO mobs (nome, tipo, dificuldade, versao, imagem) VALUES (?, ?, ?, ?, ?)";
        $stm = $con->prepare($sql);
        $stm->execute([$nome, $tipo, $dificuldade, $versao, $imagem]);

        // Redireciona com mensagem de sucesso
        header("Location: index.php?sucesso=1&mob=" . urlencode($nome));
        exit;
    } else {
        $msgErro = implode("<br>", $erros);
    }
}

include 'head.php';
?>

<body style="background-color: #275D38;">
    <header style="background-color: #3E8E41;">
        <nav class="d-flex justify-content-between align-items-center w-100 px-4 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <a href="index.php"><img class="me-5" src="../view/img/MOB Único.png" alt="" style="width: 160px;"></a>
                <h2 class="ms-5 text-white fw-bold" style="font-size: 1.875rem;">Bem vindo ao MOBÚnico!</h2>
            </div>
            <div>
                <ul class="d-flex align-items-center gap-4 list-unstyled mb-0">
                    <li class="rounded fw-bold" style="background-color: #835C3B; padding: 12px;">
                        <a class="text-white text-decoration-none" href="index.php"
                            onmouseover="this.style.color='#F0E68C'"
                            onmouseout="this.style.color='white'">Cadastrar</a>
                    </li>

                    <li class="rounded fw-bold" style="background-color: #5E7C16; padding: 12px;">                        <a class="text-white text-decoration-none" href="visualizar.php"
                            onmouseover="this.style.color='#F0E68C'"
                            onmouseout="this.style.color='white'">Visualizar</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <main class="container-fluid">
        <div class="row justify-content-center mt-5">
            <div class="col-lg-6 col-md-8 col-sm-10">                <form id="formCadastro" action="index.php" method="post" class="shadow rounded p-4" data-validate="true" style="background-color: #FFFFFF; border: 3px solid #3E8E41;">
                    <h2 class="text-center fw-bold mb-4" style="font-size: 1.5rem; color: #3E8E41;">Cadastre seu mob aqui!</h2>

                    <?php if ($msgErro): ?>
                        <div class="alert text-white" style="background-color: #835C3B;">
                            <i class="fas fa-exclamation-triangle me-2"></i><?= $msgErro ?>
                        </div>
                    <?php endif; ?>

                    <div class="form-group mb-3">
                        <label for="nome" class="form-label fw-medium" style="color: #4F4F4F;">Nome do Mob:</label>
                        <input type="text" id="nome" name="nome" maxlength="50"
                            value="<?= htmlspecialchars($nome) ?>" 
                            class="form-control" style="border: 2px solid #8B8B8B; border-radius: 8px;" 
                            placeholder="Ex: Creeper, Zombie, Enderman..." />
                    </div>

                    <div class="form-group mb-3">
                        <label for="tipo" class="form-label fw-medium" style="color: #4F4F4F;">Tipo do Mob:</label>
                        <select id="tipo" name="tipo"  class="form-select" style="border: 2px solid #8B8B8B; border-radius: 8px;">
                            <option value="">Selecione o tipo do mob</option>
                            <option value="P" <?= $tipo == 'P' ? 'selected' : '' ?>>Passivo</option>
                            <option value="M" <?= $tipo == 'M' ? 'selected' : '' ?>>Morto-vivo</option>
                            <option value="A" <?= $tipo == 'A' ? 'selected' : '' ?>>Aquático</option>
                            <option value="R" <?= $tipo == 'R' ? 'selected' : '' ?>>Artrópode</option>
                            <option value="I" <?= $tipo == 'I' ? 'selected' : '' ?>>Illager</option>
                            <option value="C" <?= $tipo == 'C' ? 'selected' : '' ?>>Chefe</option>
                        </select>
                    </div>

                    <div class="form-group mb-3">
                        <label for="dificuldade" class="form-label fw-medium" style="color: #4F4F4F;">Dificuldade:</label>
                        <select id="dificuldade" name="dificuldade"  class="form-select" style="border: 2px solid #8B8B8B; border-radius: 8px;">
                            <option value="">Selecione a dificuldade</option>
                            <option value="F" <?= $dificuldade == 'F' ? 'selected' : '' ?>>Fácil</option>
                            <option value="M" <?= $dificuldade == 'M' ? 'selected' : '' ?>>Médio</option>
                            <option value="D" <?= $dificuldade == 'D' ? 'selected' : '' ?>>Difícil</option>
                            <option value="B" <?= $dificuldade == 'B' ? 'selected' : '' ?>>Boss</option>
                        </select>
                    </div>

                    <div class="form-group mb-3">
                        <label for="versao" class="form-label fw-medium" style="color: #4F4F4F;">Versão do Minecraft:</label>
                        <input type="text" id="versao" name="versao" maxlength="10"
                            value="<?= htmlspecialchars($versao) ?>" 
                            class="form-control" style="border: 2px solid #8B8B8B; border-radius: 8px;" 
                            placeholder="Ex: 1.20.4, 1.19.2..." />
                    </div>

                    <div class="form-group mb-3">
                        <label for="imagem" class="form-label fw-medium" style="color: #4F4F4F;">URL da Imagem:</label>
                        <input type="url" id="imagem" name="imagem" 
                            value="<?= htmlspecialchars($imagem) ?>" 
                            class="form-control" style="border: 2px solid #8B8B8B; border-radius: 8px;" 
                            placeholder="https://exemplo.com/imagem-do-mob.png" />
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn text-white fw-semibold py-2 px-4" 
                                style="background-color: #33C5F3; border: none; border-radius: 8px; width: 100%;"
                                onmouseover="this.style.backgroundColor='#2AB5E3'"
                                onmouseout="this.style.backgroundColor='#33C5F3'">
                            <i class="fas fa-plus me-2"></i>Cadastrar Mob
                        </button>
                    </div>
                </form>
            </div>
        </div>    </main>

    <script>
        // Verifica se houve sucesso no cadastro
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const sucesso = urlParams.get('sucesso');
            const mobNome = urlParams.get('mob');
            
            if (sucesso === '1' && mobNome) {
                setTimeout(() => {
                    showSuccess('Mob Cadastrado!', `O mob "${decodeURIComponent(mobNome)}" foi cadastrado com sucesso!`);
                    
                    // Remove parâmetros da URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }, 500);
            }
        });
    </script>
</body>

</html>