## ADDED Requirements

### Requirement: Secret achievements unlock by comuni found
The quiz SHALL have secret achievements unlocked when the number of comuni found reaches their threshold: 69 ("Nice.", toast "😏 Nice.") and 420 ("Blaze it", toast "🌿 420 comuni. Blaze it."). Each SHALL unlock once, with a toast, the first time the count reaches or passes the threshold during play, and silently when saved progress already exceeds it. 420 SHALL NOT also appear as a visible milestone.

#### Scenario: Reaching 69
- **WHEN** the player has 68 comuni and finds one more
- **THEN** the toast "😏 Nice." appears and the secret is listed as unlocked

#### Scenario: Passing a threshold with a shared name
- **WHEN** the player has 68 comuni and types a name shared by two comuni, reaching 70
- **THEN** the 69 secret still unlocks

#### Scenario: Restored progress
- **WHEN** the page loads saved progress with 500 comuni found
- **THEN** both secrets are unlocked without toasts

### Requirement: Secret achievements stay hidden until unlocked
The achievements panel SHALL contain a "Segreti" section with an unlocked/total count. An unlocked secret SHALL show its icon, name and threshold; a locked secret SHALL show only "🔒 ???", revealing neither its name nor its threshold. Secrets SHALL count towards the overall achievements total.

#### Scenario: Before any secret
- **WHEN** the player has found 60 comuni
- **THEN** the "Segreti" section shows 0/2 and two "🔒 ???" rows, and the panel contains neither "Nice." nor "Blaze it"

#### Scenario: After 420
- **WHEN** the player has found 420 comuni
- **THEN** the "Segreti" section shows 2/2 with "😏 Nice." and "🌿 Blaze it"
