
const SONGS_URL = "https://dieuvanban.github.io/Karaoke-pro-max/songs.json?v=3";

let allSongs = [];
let filteredSongs = [];

async function loadSongs() {
    try {
        console.log("Đang tải dữ liệu:", SONGS_URL);

        const response = await fetch(SONGS_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        allSongs = await response.json();

        filteredSongs = [...allSongs];

        console.log("Đã tải", allSongs.length, "bài hát");

        renderSongs(filteredSongs);

    } catch (err) {
        console.error("Lỗi tải JSON:", err);

        alert(
            "Không tải được dữ liệu bài hát!\n\n" +
            "Chi tiết: " + err.message
        );
    }
}

function normalizeText(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function searchSongs(keyword) {

    if (!keyword.trim()) {
        renderSongs(allSongs);
        return;
    }

    const kw = normalizeText(keyword);

    const result = allSongs.filter(song => {
        return (
            normalizeText(song.title || "").includes(kw) ||
            normalizeText(song.singer || "").includes(kw) ||
            normalizeText(song.tone || "").includes(kw)
        );
    });

    renderSongs(result);
}

function renderSongs(list) {

    const box = document.getElementById("search-results");

    if (!box) return;

    if (!list.length) {
        box.innerHTML = `
            <div style="
                padding:30px;
                text-align:center;
                color:#aaa;
                font-size:18px;
            ">
                Không tìm thấy bài hát
            </div>
        `;
        return;
    }

    box.innerHTML = list.map((song, index) => `
        <div class="item">
            <div class="info-box">
                <div class="v-meta">

                    <div class="v-title">
                        ${song.title || ""}
                    </div>

                    <div class="v-singer">
                        ${song.singer || "Karaoke"}
                    </div>

                    <div class="v-stats">
                        Tone: ${song.tone || "-"}
                    </div>

                </div>

                <div class="actions-col">
                    <button class="btn-add-q"
                            onclick="showLyrics(${index})">
                        <i class="fas fa-music"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function showLyrics(index) {

    const song = allSongs[index];

    if (!song) return;

    const layer = document.getElementById("lyrics-tv-layer");
    const content = document.getElementById("lyrics-tv-content");

    if (!layer || !content) return;

    content.innerHTML = `
        <div style="
            color:#ffeb3b;
            font-size:60px;
            margin-bottom:25px;
            font-weight:bold;
        ">
            ${song.title || ""}
        </div>

        <div style="
            color:#42a5f5;
            font-size:34px;
            margin-bottom:35px;
        ">
            ${song.singer || ""}
        </div>

        <div style="
            white-space:pre-wrap;
            line-height:1.8;
            font-size:42px;
        ">
            ${song.lyrics || ""}
        </div>
    `;

    layer.style.display = "block";
}

function closeLyricsLayer() {

    const layer = document.getElementById("lyrics-tv-layer");

    if (layer) {
        layer.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {

    loadSongs();

    const input = document.getElementById("input-q");

    if (input) {

        input.addEventListener("input", e => {
            searchSongs(e.target.value);
        });

    }

    const layer = document.getElementById("lyrics-tv-layer");

    if (layer) {
        layer.addEventListener("click", closeLyricsLayer);
    }

});
