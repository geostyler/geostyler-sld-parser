<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>External Graphic</se:Name>
    <UserStyle>
      <se:Name>External Graphic</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name/>
          <se:PointSymbolizer uom="http://www.opengeospatial.org/se/units/pixel">
            <se:Graphic>
              <se:ExternalGraphic>
                <se:OnlineResource xlink:type="simple" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://geoserver.org/img/geoserver-logo.png"/>
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>0.1</se:Size>
              <se:Rotation>90.5</se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
