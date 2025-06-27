<?php
require_once("../util/Conexao.php");

$con = Conexao::getConexao();

$con = Conexao::getConexao();

$msgSucesso = "";
$msgErro = "";

if (isset($_GET['excluir']) && !empty($_GET['excluir']) && is_numeric($_GET['excluir'])) {
    $idMob = (int)$_GET['excluir'];

    try {
        // Verifica se o mob existe antes de excluir
        $sqlVerificar = "SELECT id, nome FROM mobs WHERE id = ?";
        $stmVerificar = $con->prepare($sqlVerificar);
        $stmVerificar->execute([$idMob]);
        $mob = $stmVerificar->fetch(PDO::FETCH_ASSOC);

        if ($mob) {
            // Executa a exclusão
            $sqlExcluir = "DELETE FROM mobs WHERE id = ?";
            $stmExcluir = $con->prepare($sqlExcluir);
            
            if ($stmExcluir->execute([$idMob])) {
                $msgSucesso = "Mob '{$mob['nome']}' excluído com sucesso!";
                
                // Redireciona para limpar a URL
                header("Location: visualizar.php?sucesso=1");
                exit;
            } else {
                $msgErro = "Erro ao executar a exclusão no banco de dados.";
            }
        } else {
            $msgErro = "Mob não encontrado ou já foi excluído.";
        }
    } catch (PDOException $e) {
        $msgErro = "Erro no banco de dados: " . $e->getMessage();
    } catch (Exception $e) {
        $msgErro = "Erro inesperado: " . $e->getMessage();
    }
}

if (isset($_GET['sucesso']) && $_GET['sucesso'] == '1') {
    $msgSucesso = "Mob excluído com sucesso!";
}

// Busca todos os mobs ordenados por nome
$sql = "SELECT * FROM mobs ORDER BY nome";
$stm = $con->prepare($sql);
$stm->execute();
$mobs = $stm->fetchAll();

function getTipoTexto($tipo)
{
    $tipos = [
        'P' => 'Passivo',
        'M' => 'Morto-vivo',
        'A' => 'Aquático',
        'R' => 'Artrópode',
        'I' => 'Illager',
        'C' => 'Chefe'
    ];
    return $tipos[$tipo] ?? 'Desconhecido';
}

function getDificuldadeTexto($dificuldade)
{
    $dificuldades = [
        'F' => 'Fácil',
        'M' => 'Médio',
        'D' => 'Difícil',
        'B' => 'Boss'
    ];
    return $dificuldades[$dificuldade] ?? 'Desconhecido';
}

function getCorTipo($tipo)
{
    $cores = [
        'P' => 'success',
        'M' => 'dark',
        'A' => 'info',
        'R' => 'warning',
        'I' => 'danger',
        'C' => 'primary'
    ];
    return $cores[$tipo] ?? 'secondary';
}

function getCorDificuldade($dificuldade)
{
    $cores = [
        'F' => 'success',
        'M' => 'warning',
        'D' => 'danger',
        'B' => 'dark'
    ];
    return $cores[$dificuldade] ?? 'secondary';
}

// Função para obter cor personalizada baseada no tipo (nova paleta)
function getCorTipoPersonalizada($tipo)
{
    $cores = [
        'P' => '#3E8E41', // Verde Principal - Passivo
        'M' => '#835C3B', // Marrom Terra - Morto-vivo
        'A' => '#33C5F3', // Azul Diamante - Aquático
        'R' => '#F0E68C', // Amarelo Contraste - Artrópode
        'I' => '#275D38', // Verde Musgo Escuro - Illager
        'C' => '#5E7C16'  // Verde Bloco - Chefe
    ];
    return $cores[$tipo] ?? '#8B8B8B';
}

// Função para obter cor personalizada baseada na dificuldade (nova paleta)
function getCorDificuldadePersonalizada($dificuldade)
{
    $cores = [
        'F' => '#3E8E41', // Verde Principal - Fácil
        'M' => '#F0E68C', // Amarelo Contraste - Médio
        'D' => '#835C3B', // Marrom Terra - Difícil
        'B' => '#275D38'  // Verde Musgo Escuro - Boss
    ];
    return $cores[$dificuldade] ?? '#8B8B8B';
}

include 'head.php';
?>

<body style="background-color: #275D38;">
    <header style="background-color: #3E8E41;">
        <nav class="d-flex justify-content-between align-items-center w-100 px-4 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <a href="index.php"><img class="me-5" src="../view/img/MOB Único.png" alt="" style="width: 160px;"></a>
                <h2 class="ms-5 text-white fw-bold" style="font-size: 1.875rem;">Visualizar Mobs</h2>
            </div>
            <div>
                <ul class="d-flex align-items-center gap-4 list-unstyled mb-0">
                    <li class="rounded fw-bold" style="background-color: #5E7C16; padding: 12px;">
                        <a class="text-white text-decoration-none" href="index.php"
                            onmouseover="this.style.color='#F0E68C'"
                            onmouseout="this.style.color='white'">Cadastrar</a>
                    </li>

                    <li class="rounded fw-bold" style="background-color: #835C3B; padding: 12px;">
                        <a class="text-white text-decoration-none" href="visualizar.php"
                            onmouseover="this.style.color='#F0E68C'"
                            onmouseout="this.style.color='white'">Visualizar</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <main class="container-fluid mt-4">
        <!-- Mensagens de Sucesso/Erro -->
        <?php if ($msgSucesso): ?>
            <div class="row mb-3">
                <div class="col-12">
                    <div class="alert text-white text-center" style="background-color: #3E8E41; border-color: #5E7C16;">
                        <i class="fas fa-check-circle me-2"></i><?= $msgSucesso ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($msgErro): ?>
            <div class="row mb-3">
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        <i class="fas fa-exclamation-triangle me-2"></i><?= $msgErro ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Controles de Visualização -->
        <div class="row mb-4">
            <div class="col-12 text-center">
                <div class="btn-group" role="group" aria-label="Tipo de visualização">
                    <button type="button" class="btn text-white fw-bold" id="btnCards" onclick="mostrarCards()"
                        style="background-color: #33C5F3; border-color: #33C5F3;">
                        <i class="fas fa-th-large"></i> Cards
                    </button>
                    <button type="button" class="btn text-white fw-bold" id="btnTabela" onclick="mostrarTabela()"
                        style="background-color: #8B8B8B; border-color: #8B8B8B;">
                        <i class="fas fa-table"></i> Tabela
                    </button>
                </div>
            </div>
        </div>

        <!-- Contador de Mobs -->
        <div class="row mb-3">
            <div class="col-12">
                <div class="alert text-center text-white" style="background-color: #F0E68C; color: #4F4F4F !important;">
                    <strong style="color: #4F4F4F;">Total de Mobs Cadastrados: <?= count($mobs) ?></strong>
                </div>
            </div>
        </div> <!-- Visualização em Cards (padrão) -->
        <div id="visualizacaoCards">
            <?php if (count($mobs) > 0): ?>
                <div class="masonry-container">
                    <?php foreach ($mobs as $mob): ?>
                        <div class="masonry-item">
                            <div class="card shadow-sm h-auto" style="background-color: #FFFFFF; border: 2px solid #8B8B8B;">
                                <div class="position-relative">
                                    <img src="<?= htmlspecialchars($mob['imagem']) ?>"
                                        class="card-img-top"
                                        alt="<?= htmlspecialchars($mob['nome']) ?>"
                                        style="width: 100%; height: auto; object-fit: cover; border-radius: 8px 8px 0 0;"
                                        onerror="this.src='https://via.placeholder.com/250x200?text=Imagem+Não+Encontrada'">

                                    <!-- Botão de exclusão -->
                                    <button type="button" class="btn btn-sm position-absolute top-0 end-0 m-2"
                                        style="background-color: #835C3B; border: none; border-radius: 50%; width: 35px; height: 35px;"
                                        onclick="confirmarExclusao(<?= $mob['id'] ?>, '<?= htmlspecialchars($mob['nome'], ENT_QUOTES) ?>')"
                                        title="Excluir <?= htmlspecialchars($mob['nome']) ?>">
                                        <i class="fas fa-trash text-white"></i>
                                    </button>
                                </div>

                                <div class="card-body p-3">
                                    <h6 class="card-title fw-bold mb-2" style="color: #3E8E41;">
                                        <?= htmlspecialchars($mob['nome']) ?>
                                    </h6>
                                    <div class="mb-2">
                                        <span class="badge badge-sm me-1" style="background-color: <?= getCorTipoPersonalizada($mob['tipo']) ?>; color: white;">
                                            <?= getTipoTexto($mob['tipo']) ?>
                                        </span>
                                        <span class="badge badge-sm" style="background-color: <?= getCorDificuldadePersonalizada($mob['dificuldade']) ?>; color: white;">
                                            <?= getDificuldadeTexto($mob['dificuldade']) ?>
                                        </span>
                                    </div>
                                    <p class="card-text small mb-1" style="color: #4F4F4F;">
                                        <i class="fas fa-cube me-1" style="color: #33C5F3;"></i>Versão <?= htmlspecialchars($mob['versao']) ?>
                                    </p>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="text-center">
                    <div class="alert text-white" style="background-color: #F0E68C; color: #4F4F4F !important;">
                        <h4 style="color: #4F4F4F;">Nenhum mob cadastrado ainda!</h4>
                        <p style="color: #4F4F4F;">Que tal <a href="index.php" style="color: #3E8E41; text-decoration: underline;">cadastrar o primeiro mob</a>?</p>
                    </div>
                </div>
            <?php endif; ?>
        </div> <!-- Visualização em Tabela (oculta por padrão) -->
        <div id="visualizacaoTabela" style="display: none;">
            <?php if (count($mobs) > 0): ?>
                <div class="table-responsive">
                    <table class="table table-hover table-striped" style="background-color: #FFFFFF;">
                        <thead style="background-color: #3E8E41;">
                            <tr>
                                <th scope="col" class="text-white">#</th>
                                <th scope="col" class="text-white">Imagem</th>
                                <th scope="col" class="text-white">Nome</th>
                                <th scope="col" class="text-white">Tipo</th>
                                <th scope="col" class="text-white">Dificuldade</th>
                                <th scope="col" class="text-white">Versão</th>
                                <th scope="col" class="text-white">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($mobs as $index => $mob): ?>
                                <tr style="background-color: <?= $index % 2 == 0 ? '#FFFFFF' : '#F8F9FA' ?>;">
                                    <th scope="row" style="color: #4F4F4F;"><?= $index + 1 ?></th>
                                    <td>
                                        <img src="<?= htmlspecialchars($mob['imagem']) ?>"
                                            alt="<?= htmlspecialchars($mob['nome']) ?>"
                                            style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 2px solid #8B8B8B;"
                                            onerror="this.src='https://via.placeholder.com/50x50?text=?'">
                                    </td>
                                    <td class="fw-bold" style="color: #3E8E41;"><?= htmlspecialchars($mob['nome']) ?></td>
                                    <td>
                                        <span class="badge" style="background-color: <?= getCorTipoPersonalizada($mob['tipo']) ?>; color: white;">
                                            <?= getTipoTexto($mob['tipo']) ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge" style="background-color: <?= getCorDificuldadePersonalizada($mob['dificuldade']) ?>; color: white;">
                                            <?= getDificuldadeTexto($mob['dificuldade']) ?>
                                        </span>
                                    </td>
                                    <td style="color: #4F4F4F;"><?= htmlspecialchars($mob['versao']) ?></td>
                                    <td>
                                        <button type="button" class="btn btn-sm"
                                            style="background-color: #835C3B; color: white; border: none;"
                                            onclick="confirmarExclusao(<?= $mob['id'] ?>, '<?= htmlspecialchars($mob['nome'], ENT_QUOTES) ?>')"
                                            title="Excluir <?= htmlspecialchars($mob['nome']) ?>">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php else: ?>
                <div class="text-center">
                    <div class="alert text-white" style="background-color: #F0E68C; color: #4F4F4F !important;">
                        <h4 style="color: #4F4F4F;">Nenhum mob cadastrado ainda!</h4>
                        <p style="color: #4F4F4F;">Que tal <a href="index.php" style="color: #3E8E41; text-decoration: underline;">cadastrar o primeiro mob</a>?</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <script>
        function confirmarExclusao(id, nome) {
            if (confirm(`Tem certeza que deseja excluir o mob "${nome}"? Esta ação não pode ser desfeita!`)) {
                window.location.href = `visualizar.php?excluir=${id}`;
            }
        }
    </script>
</body>

</html>