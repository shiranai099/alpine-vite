# =============================================================================
# 設定変数 — AWS リソース作成後に実際の値に更新してください
# =============================================================================
PROFILE  := alpine-vite-deploy
BUCKET   := your-s3-bucket-name
DIST_ID  := your-cloudfront-dist-id
REGION   := ap-northeast-1
DIST_DIR := dist

# =============================================================================
# 認証
# =============================================================================

## AWS SSO でログインする（ブラウザが開き MFA 認証が求められる）
.PHONY: login
login:
	aws sso login --profile $(PROFILE)

## 現在の認証情報を確認する
.PHONY: whoami
whoami:
	aws sts get-caller-identity --profile $(PROFILE)

# =============================================================================
# ビルド
# =============================================================================

## フロントエンドをビルドする（dist/ に出力）
.PHONY: build
build:
	npm run build

# =============================================================================
# デプロイ
# =============================================================================

## ビルド + S3 アップロード + CloudFront キャッシュ破棄
.PHONY: deploy
deploy: build
	aws s3 sync $(DIST_DIR)/ s3://$(BUCKET) \
		--delete \
		--profile $(PROFILE) \
		--region $(REGION)
	aws cloudfront create-invalidation \
		--distribution-id $(DIST_ID) \
		--paths "/*" \
		--profile $(PROFILE)

## S3 にアップロードのみ（キャッシュ破棄なし）
.PHONY: upload
upload:
	aws s3 sync $(DIST_DIR)/ s3://$(BUCKET) \
		--delete \
		--profile $(PROFILE) \
		--region $(REGION)

## CloudFront キャッシュを破棄のみ
.PHONY: invalidate
invalidate:
	aws cloudfront create-invalidation \
		--distribution-id $(DIST_ID) \
		--paths "/*" \
		--profile $(PROFILE)

# =============================================================================
# 確認・その他
# =============================================================================

## S3 バケットの中身を確認する
.PHONY: ls
ls:
	aws s3 ls s3://$(BUCKET) --recursive --profile $(PROFILE)

## ヘルプを表示する
.PHONY: help
help:
	@echo ""
	@echo "使い方:"
	@echo "  make login       AWS SSO 認証（作業開始時に毎回実行）"
	@echo "  make whoami      認証確認"
	@echo "  make deploy      ビルド + S3 アップロード + キャッシュ破棄"
	@echo "  make build       ビルドのみ"
	@echo "  make upload      S3 アップロードのみ"
	@echo "  make invalidate  CloudFront キャッシュ破棄のみ"
	@echo "  make ls          S3 バケット内容確認"
	@echo ""
	@echo "BUCKET=$(BUCKET)"
	@echo "DIST_ID=$(DIST_ID)"
	@echo "PROFILE=$(PROFILE)"
	@echo ""

.DEFAULT_GOAL := help
