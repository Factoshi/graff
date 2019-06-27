import { AdminEntryResolvers, AdminCode } from '../types/resolvers';

export const adminEntryResolvers: AdminEntryResolvers = {
    __resolveType: parent => {
        switch (parent.code as AdminCode) {
            case AdminCode.DirectoryBlockSignature:
                return 'DirectoryBlockSignature';
            case AdminCode.RevealMatryoshkaHash:
            case AdminCode.AddReplaceMatryoshkaHash:
                return 'MatryoshkaHash';
            case AdminCode.IncreaseServerCount:
                return 'IncreaseServerCount';
            case AdminCode.AddFederatedServer:
            case AdminCode.AddAuditServer:
            case AdminCode.RemoveFederatedServer:
                return 'AddRemoveServer';
            case AdminCode.AddFederatedServerSigningKey:
                return 'AddFederatedServerSigningKey';
            case AdminCode.AddFederatedServerBitcoinAnchorKey:
                return 'AddFederatedServerBitcoinAnchorKey';
            case AdminCode.ServerFaultHandoff:
                return 'ServerFaultHandoff';
            case AdminCode.CoinbaseDescriptor:
                return 'CoinbaseDescriptor';
            case AdminCode.CoinbaseDescriptorCancel:
                return 'CoinbaseDescriptorCancel';
            case AdminCode.AddAuthorityFactoidAddress:
                return 'AddAuthorityFactoidAddress';
            case AdminCode.AddAuthorityEfficiency:
                return 'AddAuthorityEfficiency';
        }
    }
};
