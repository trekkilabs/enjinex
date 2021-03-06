// 'test' is only active during unit tests
export type NodeEnv = 'development' | 'test' | 'staging' | 'production';
type YesOrNo = 'N' | 'Y';

export interface Env {
	/**
	 * Mandatory email for domain owner
	 */
	CERTBOT_EMAIL: string;
	/**
	 * Set `Y` to skip the real certificate request and just do a dry-run
	 * @default N
	 */
	DRY_RUN: YesOrNo;
	/**
	 * Set `Y` to run without making a real certbot request
	 * @default N
	 */
	ISOLATED: YesOrNo;
	/**
	 * Current environment
	 * @default development
	 */
	NODE_ENV: NodeEnv;
}

/**
 * Get current environment properties
 */
export const getEnv = (): Env => {
	return {
		CERTBOT_EMAIL: process.env.CERTBOT_EMAIL ?? '',
		DRY_RUN: (process.env.DRY_RUN ?? 'N') as YesOrNo,
		ISOLATED: (process.env.ISOLATED ?? 'N') as YesOrNo,
		NODE_ENV: (process.env.NODE_ENV ?? 'development') as NodeEnv
	};
};
