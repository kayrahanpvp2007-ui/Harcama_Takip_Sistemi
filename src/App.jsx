import { useState } from "react";

function App() {

  const [islemler, setIslemler] = useState([
    { id: 1, aciklama: "Maaş", tutar: 12500, kategori: "Gelir", tur: "gelir" },
    { id: 2, aciklama: "Market alışverişi", tutar: 1850, kategori: "Yemek", tur: "gider" },
    { id: 3, aciklama: "Elektrik faturası", tutar: 970, kategori: "Fatura", tur: "gider" },
  ]);

  const [aciklama, setAciklama] = useState("");
  const [tutar, setTutar] = useState("");
  const [kategori, setKategori] = useState("");
  const [tur, setTur] = useState("gider");
  const [hata, setHata] = useState(false);

  const [turFiltre, setTurFiltre] = useState("hepsi");
  const [kategoriFiltre, setKategoriFiltre] = useState("");

  const gelir = islemler
      .filter((islem) => islem.tur === "gelir")
      .reduce((toplam, islem) => toplam + islem.tutar, 0);

  const gider = islemler
      .filter((islem) => islem.tur === "gider")
      .reduce((toplam, islem) => toplam + islem.tutar, 0);

  const bakiye = gelir - gider;

  function islemEkle(e) {
    e.preventDefault();

    if (aciklama === "" || tutar === "" || kategori === "") {
      setHata(true);
      return;
    }
    setHata(false);

    const yeniIslem = {
      id: Date.now(),
      aciklama: aciklama,
      tutar: Number(tutar),
      kategori: kategori,
      tur: tur,
    };

    setIslemler([...islemler, yeniIslem]);

    setAciklama("");
    setTutar("");
    setKategori("");
    setTur("gider");
  }

  function islemSil(id) {
    setIslemler(islemler.filter((islem) => islem.id !== id));
  }

  const filtreliIslemler = islemler.filter((islem) => {
    const turUyuyor = turFiltre === "hepsi" || islem.tur === turFiltre;
    const kategoriUyuyor = kategoriFiltre === "" || islem.kategori === kategoriFiltre;
    return turUyuyor && kategoriUyuyor;
  });

  return (
      <div className="app">

        <h1 className="app-title">Harcama Takip</h1>

        <section className="summary">
          <div className="summary-card">
            <p className="summary-label">Toplam gelir</p>
            <p className="summary-value income">₺{gelir.toLocaleString("tr-TR")}</p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Toplam gider</p>
            <p className="summary-value expense">₺{gider.toLocaleString("tr-TR")}</p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Bakiye</p>
            <p className="summary-value">₺{bakiye.toLocaleString("tr-TR")}</p>
          </div>
        </section>

        <section className="card form-card">
          <p className="card-title">Yeni işlem ekle</p>
          <form className="transaction-form" onSubmit={islemEkle}>
            <input
                type="text"
                placeholder="Açıklama"
                className="input input-desc"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
            />
            <input
                type="number"
                placeholder="Tutar (₺)"
                className="input"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
            />
            <select
                className="input"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
            >
              <option value="">Kategori</option>
              <option value="Yemek">Yemek</option>
              <option value="Ulaşım">Ulaşım</option>
              <option value="Fatura">Fatura</option>
              <option value="Eğlence">Eğlence</option>
              <option value="Gelir">Gelir</option>
            </select>
            <select
                className="input"
                value={tur}
                onChange={(e) => setTur(e.target.value)}
            >
              <option value="gider">Gider</option>
              <option value="gelir">Gelir</option>
            </select>
            <button type="submit" className="btn btn-add">+ Ekle</button>
          </form>
          {hata && <p className="form-error">Lütfen tüm alanları doldurun!!!</p>}
        </section>

        <section className="filters">
          <span className="filters-label">Filtre:</span>
          <select
              className="input input-sm"
              value={turFiltre}
              onChange={(e) => setTurFiltre(e.target.value)}
          >
            <option value="hepsi">Tümü</option>
            <option value="gelir">Gelirler</option>
            <option value="gider">Giderler</option>
          </select>
          <select
              className="input input-sm"
              value={kategoriFiltre}
              onChange={(e) => setKategoriFiltre(e.target.value)}
          >
            <option value="">Tüm kategoriler</option>
            <option value="Yemek">Yemek</option>
            <option value="Ulaşım">Ulaşım</option>
            <option value="Fatura">Fatura</option>
            <option value="Eğlence">Eğlence</option>
            <option value="Gelir">Gelir</option>
          </select>
        </section>

        <section className="card list-card">
          {filtreliIslemler.length === 0 ? (
              <p className="empty-message">Henüz işlem eklenmedi.</p>
          ) : (
              filtreliIslemler.map((islem) => (
                  <div className="transaction-item" key={islem.id}>
                    <div className="transaction-info">
                      <p className="transaction-desc">{islem.aciklama}</p>
                      <p className="transaction-category">{islem.kategori}</p>
                    </div>
                    <div className="transaction-right">
                <span className={`transaction-amount ${islem.tur === "gelir" ? "income" : "expense"}`}>
                  {islem.tur === "gelir" ? "+" : "-"}₺{islem.tutar.toLocaleString("tr-TR")}
                </span>
                      <button
                          className="btn btn-delete"
                          aria-label="Sil"
                          onClick={() => islemSil(islem.id)}
                      >
                        sil
                      </button>
                    </div>
                  </div>
              ))
          )}
        </section>

      </div>
  );
}

export default App;